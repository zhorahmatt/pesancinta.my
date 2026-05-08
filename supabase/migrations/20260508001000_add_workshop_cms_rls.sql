create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_cms_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

alter table public.admin_users enable row level security;
alter table public.workshops enable row level security;
alter table public.workshop_locales enable row level security;
alter table public.workshop_prices enable row level security;
alter table public.payment_methods enable row level security;
alter table public.registrations enable row level security;
alter table public.payment_proofs enable row level security;

create policy "admins can read admin users"
on public.admin_users
for select
using (public.is_cms_admin());

create policy "admins can manage admin users"
on public.admin_users
for all
using (public.is_cms_admin())
with check (public.is_cms_admin());

create policy "public can read published workshops"
on public.workshops
for select
using (status = 'published');

create policy "admins can manage workshops"
on public.workshops
for all
using (public.is_cms_admin())
with check (public.is_cms_admin());

create policy "public can read published workshop locales"
on public.workshop_locales
for select
using (
  exists (
    select 1
    from public.workshops
    where workshops.id = workshop_locales.workshop_id
      and workshops.status = 'published'
  )
);

create policy "admins can manage workshop locales"
on public.workshop_locales
for all
using (public.is_cms_admin())
with check (public.is_cms_admin());

create policy "public can read published workshop prices"
on public.workshop_prices
for select
using (
  exists (
    select 1
    from public.workshops
    where workshops.id = workshop_prices.workshop_id
      and workshops.status = 'published'
  )
);

create policy "admins can manage workshop prices"
on public.workshop_prices
for all
using (public.is_cms_admin())
with check (public.is_cms_admin());

create policy "public can read active payment methods for published workshops"
on public.payment_methods
for select
using (
  is_active
  and exists (
    select 1
    from public.workshops
    where workshops.id = payment_methods.workshop_id
      and workshops.status = 'published'
  )
);

create policy "admins can manage payment methods"
on public.payment_methods
for all
using (public.is_cms_admin())
with check (public.is_cms_admin());

create policy "public can submit registrations"
on public.registrations
for insert
with check (true);

create policy "admins can manage registrations"
on public.registrations
for all
using (public.is_cms_admin())
with check (public.is_cms_admin());

create policy "admins can read payment proofs"
on public.payment_proofs
for select
using (public.is_cms_admin());

create policy "public can submit payment proofs"
on public.payment_proofs
for insert
with check (
  exists (
    select 1
    from public.registrations
    where registrations.id = payment_proofs.registration_id
  )
);

create policy "admins can manage payment proofs"
on public.payment_proofs
for all
using (public.is_cms_admin())
with check (public.is_cms_admin());
