-- Move the Inner Compass workshop page content (formerly in
-- src/content/innerCompass.json) into Supabase so the admin editor works in
-- production. Single-row table; the entire InnerCompassData shape lives in
-- one jsonb column. RPCs gate writes on is_cms_admin() and are security
-- definer so the public page can call the read RPC without RLS friction.

create table if not exists public.inner_compass_content (
  id int primary key default 1 check (id = 1),
  data jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

alter table public.inner_compass_content enable row level security;

-- Public read so future anon clients can hit the table directly if needed.
-- Today the read path uses the security-definer RPC below.
drop policy if exists "public can read inner compass content" on public.inner_compass_content;
create policy "public can read inner compass content"
  on public.inner_compass_content
  for select
  using (true);

-- Admin-only writes.
drop policy if exists "admins can manage inner compass content" on public.inner_compass_content;
create policy "admins can manage inner compass content"
  on public.inner_compass_content
  for all
  using (public.is_cms_admin())
  with check (public.is_cms_admin());

-- Read RPC. Returns the full content as a single jsonb document.
-- SECURITY DEFINER so the caller's role doesn't need any table-level grant.
create or replace function public.get_inner_compass_content()
returns jsonb
language sql
security definer
stable
set search_path = public
as $$
  select data from public.inner_compass_content where id = 1 limit 1;
$$;

revoke all on function public.get_inner_compass_content() from public;
grant execute on function public.get_inner_compass_content() to anon, authenticated;

-- Write RPC. Gates on is_cms_admin() for defense in depth.
create or replace function public.save_inner_compass_content(p_data jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_cms_admin() then
    raise exception 'Only admins can edit Inner Compass content' using errcode = '42501';
  end if;

  insert into public.inner_compass_content (id, data, updated_at, updated_by)
  values (1, p_data, now(), auth.uid())
  on conflict (id) do update set
    data = excluded.data,
    updated_at = now(),
    updated_by = excluded.updated_by;
end;
$$;

revoke all on function public.save_inner_compass_content(jsonb) from public;
grant execute on function public.save_inner_compass_content(jsonb) to authenticated;

-- Storage bucket for image uploads from the editor.
insert into storage.buckets (id, name, public)
values ('inner-compass-uploads', 'inner-compass-uploads', true)
on conflict (id) do nothing;

drop policy if exists "public can read inner compass uploads" on storage.objects;
create policy "public can read inner compass uploads"
  on storage.objects
  for select
  using (bucket_id = 'inner-compass-uploads');

drop policy if exists "admins can write inner compass uploads" on storage.objects;
create policy "admins can write inner compass uploads"
  on storage.objects
  for insert
  with check (bucket_id = 'inner-compass-uploads' and public.is_cms_admin());

drop policy if exists "admins can update inner compass uploads" on storage.objects;
create policy "admins can update inner compass uploads"
  on storage.objects
  for update
  using (bucket_id = 'inner-compass-uploads' and public.is_cms_admin())
  with check (bucket_id = 'inner-compass-uploads' and public.is_cms_admin());

drop policy if exists "admins can delete inner compass uploads" on storage.objects;
create policy "admins can delete inner compass uploads"
  on storage.objects
  for delete
  using (bucket_id = 'inner-compass-uploads' and public.is_cms_admin());

notify pgrst, 'reload schema';
