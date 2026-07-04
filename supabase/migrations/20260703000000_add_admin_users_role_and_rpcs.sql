-- One-shot recovery: fully reset all admin_users-related objects on the remote
-- Supabase project. Run this in Supabase Studio SQL editor.
--
-- Drops the old view, the old functions (which depended on the view's type),
-- then recreates everything in a clean order. Safe to run multiple times.

-- 1. Drop dependents first (the function return type references the view type).
drop function if exists public.create_cms_admin(text, text, text);
drop function if exists public.delete_cms_admin(uuid);
drop function if exists public.list_cms_admins();
drop view if exists public.admin_users_with_email;

-- 2. Make sure pgcrypto is available (no-op if already installed).
do $$
begin
  if not exists (select 1 from pg_extension where extname = 'pgcrypto') then
    begin
      create extension pgcrypto with schema extensions;
    exception when insufficient_privilege then
      null;
    end;
  end if;
end$$;

-- 3. Add the role column.
alter table public.admin_users
  add column if not exists role text not null default 'admin';

alter table public.admin_users
  drop constraint if exists admin_users_role_check;

alter table public.admin_users
  add constraint admin_users_role_check
  check (role in ('admin'));

-- 4. list_cms_admins: read-only RPC. SECURITY DEFINER so it can join
-- auth.users without exposing that table to the authenticated role.
-- Explicit aliases on every projection column to avoid any ambiguity.
create or replace function public.list_cms_admins()
returns table (user_id uuid, email text, role text, created_at timestamptz)
language sql
security definer
stable
set search_path = public, auth
as $$
  select
    au.user_id as user_id,
    u.email::text as email,
    au.role as role,
    au.created_at as created_at
  from public.admin_users au
  join auth.users u on u.id = au.user_id
  where public.is_cms_admin();
$$;

revoke all on function public.list_cms_admins() from public;
grant execute on function public.list_cms_admins() to authenticated;

-- 5. create_cms_admin: writes. Gated on is_cms_admin(). Uses extensions.crypt.
create or replace function public.create_cms_admin(
  p_email text,
  p_password text,
  p_role text default 'admin'
)
returns table (user_id uuid, email text, role text, created_at timestamptz)
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
  v_uid uuid := gen_random_uuid();
  v_email text := lower(trim(p_email));
  v_role text := coalesce(p_role, 'admin');
  v_now timestamptz := now();
  v_existing_id uuid;
begin
  if not public.is_cms_admin() then
    raise exception 'Only existing admins can create admins' using errcode = '42501';
  end if;

  if v_role not in ('admin') then
    raise exception 'Unsupported role: %', v_role using errcode = '22023';
  end if;

  if p_password is null or length(p_password) < 8 then
    raise exception 'Password must be at least 8 characters' using errcode = '22023';
  end if;

  if v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'Invalid email address' using errcode = '22023';
  end if;

  select id into v_existing_id from auth.users au where au.email = v_email limit 1;
  if v_existing_id is not null then
    raise exception 'A user with that email already exists' using errcode = '23505';
  end if;

  insert into auth.users (
    instance_id, id, aud, role, email,
    encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at,
    confirmation_token, email_change, email_change_token_new, recovery_token
  ) values (
    '00000000-0000-0000-0000-000000000000',
    v_uid, 'authenticated', 'authenticated', v_email,
    extensions.crypt(p_password, extensions.gen_salt('bf', 10)),
    v_now,
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('role', v_role),
    v_now, v_now,
    '', '', '', ''
  );

  insert into auth.identities (
    id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
  ) values (
    v_uid, v_uid,
    v_uid::text,
    jsonb_build_object('sub', v_uid::text, 'email', v_email, 'email_verified', true),
    'email', v_now, v_now, v_now
  );

  insert into public.admin_users (user_id, role, created_at)
  values (v_uid, v_role, v_now);

  return query
    select v_uid as user_id, v_email as email, v_role as role, v_now as created_at;
end;
$$;

revoke all on function public.create_cms_admin(text, text, text) from public;
grant execute on function public.create_cms_admin(text, text, text) to authenticated;

-- 6. delete_cms_admin: refuses self-delete.
create or replace function public.delete_cms_admin(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if not public.is_cms_admin() then
    raise exception 'Only existing admins can remove admins' using errcode = '42501';
  end if;

  if p_user_id = auth.uid() then
    raise exception 'You cannot remove your own admin account' using errcode = '23514';
  end if;

  if not exists (select 1 from public.admin_users au where au.user_id = p_user_id) then
    raise exception 'Admin not found' using errcode = 'P0002';
  end if;

  delete from auth.users au where au.id = p_user_id;
end;
$$;

revoke all on function public.delete_cms_admin(uuid) from public;
grant execute on function public.delete_cms_admin(uuid) to authenticated;

-- 7. Refresh PostgREST cache.
notify pgrst, 'reload schema';

-- 8. Sanity check: list the admin functions that now exist.
select proname from pg_proc
where proname in ('list_cms_admins','create_cms_admin','delete_cms_admin')
order by proname;
