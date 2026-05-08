create or replace function public.confirm_registration(registration_id uuid)
returns public.registrations
language plpgsql
security definer
set search_path = public
as $$
declare
  target_registration public.registrations;
  target_workshop public.workshops;
  confirmed_count integer;
begin
  if not public.is_cms_admin() then
    raise exception 'Only CMS admins can confirm registrations';
  end if;

  select *
  into target_registration
  from public.registrations
  where id = registration_id
  for update;

  if not found then
    raise exception 'Registration not found';
  end if;

  if target_registration.status = 'confirmed' then
    return target_registration;
  end if;

  select *
  into target_workshop
  from public.workshops
  where id = target_registration.workshop_id
  for update;

  select count(*)
  into confirmed_count
  from public.registrations
  where workshop_id = target_registration.workshop_id
    and status = 'confirmed';

  if confirmed_count >= target_workshop.capacity then
    raise exception 'Workshop capacity is full';
  end if;

  update public.registrations
  set status = 'confirmed', updated_at = now()
  where id = registration_id
  returning * into target_registration;

  return target_registration;
end;
$$;

create or replace function public.get_confirmed_registration_count(workshop_id uuid)
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::integer
  from public.registrations
  where registrations.workshop_id = get_confirmed_registration_count.workshop_id
    and status = 'confirmed';
$$;

insert into storage.buckets (id, name, public)
values ('payment-proofs', 'payment-proofs', false)
on conflict (id) do update set public = false;

create policy "public can upload payment proofs"
on storage.objects
for insert
with check (
  bucket_id = 'payment-proofs'
  and split_part(name, '/', 1)::uuid in (
    select id from public.registrations
  )
);

create policy "admins can read payment proof objects"
on storage.objects
for select
using (
  bucket_id = 'payment-proofs'
  and public.is_cms_admin()
);

create policy "admins can manage payment proof objects"
on storage.objects
for all
using (
  bucket_id = 'payment-proofs'
  and public.is_cms_admin()
)
with check (
  bucket_id = 'payment-proofs'
  and public.is_cms_admin()
);
