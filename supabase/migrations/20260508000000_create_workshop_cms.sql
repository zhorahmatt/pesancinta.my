create type public.workshop_status as enum ('draft', 'published', 'archived');
create type public.workshop_locale as enum ('ms', 'id', 'en');
create type public.workshop_currency as enum ('MYR', 'IDR');
create type public.workshop_country as enum ('MY', 'ID');
create type public.payment_method_type as enum ('bank_transfer', 'static_qr');
create type public.registration_status as enum ('pending', 'awaiting_payment', 'payment_submitted', 'confirmed', 'cancelled', 'refunded');
create type public.payment_proof_status as enum ('submitted', 'approved', 'rejected');

create table public.workshops (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  status public.workshop_status not null default 'draft',
  theme_key text not null default 'inner-compass',
  default_locale public.workshop_locale not null default 'ms',
  start_at timestamptz not null,
  end_at timestamptz,
  venue_name text not null,
  city text not null,
  country public.workshop_country not null,
  capacity integer not null check (capacity > 0),
  show_remaining_seats boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  check (end_at is null or end_at >= start_at)
);

create table public.workshop_locales (
  id uuid primary key default gen_random_uuid(),
  workshop_id uuid not null references public.workshops(id) on delete cascade,
  locale public.workshop_locale not null,
  headline text not null,
  subheadline text,
  description text,
  cta_label text not null,
  sections_json jsonb not null default '{}'::jsonb,
  registration_message text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workshop_id, locale)
);

create table public.workshop_prices (
  id uuid primary key default gen_random_uuid(),
  workshop_id uuid not null references public.workshops(id) on delete cascade,
  currency public.workshop_currency not null,
  amount integer not null check (amount >= 0),
  early_bird_amount integer check (early_bird_amount is null or early_bird_amount >= 0),
  early_bird_ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workshop_id, currency)
);

create table public.payment_methods (
  id uuid primary key default gen_random_uuid(),
  workshop_id uuid not null references public.workshops(id) on delete cascade,
  country public.workshop_country not null,
  type public.payment_method_type not null,
  label text not null,
  currency public.workshop_currency not null,
  instructions text not null,
  account_name text,
  account_number text,
  bank_name text,
  qr_image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (type = 'bank_transfer' and account_name is not null and account_number is not null and bank_name is not null)
    or (type = 'static_qr' and qr_image_url is not null)
  )
);

create table public.registrations (
  id uuid primary key default gen_random_uuid(),
  workshop_id uuid not null references public.workshops(id) on delete restrict,
  full_name text not null,
  email text not null,
  phone text not null,
  country public.workshop_country not null,
  locale public.workshop_locale not null default 'ms',
  payment_method_id uuid references public.payment_methods(id) on delete set null,
  status public.registration_status not null default 'awaiting_payment',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  check (length(trim(full_name)) > 1),
  check (length(trim(phone)) > 5)
);

create table public.payment_proofs (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references public.registrations(id) on delete cascade,
  file_url text not null,
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id) on delete set null,
  status public.payment_proof_status not null default 'submitted',
  check (reviewed_at is null or reviewed_at >= submitted_at)
);

create index workshops_status_idx on public.workshops(status);
create index workshops_start_at_idx on public.workshops(start_at);
create index workshop_locales_workshop_id_idx on public.workshop_locales(workshop_id);
create index workshop_prices_workshop_id_idx on public.workshop_prices(workshop_id);
create index payment_methods_workshop_id_idx on public.payment_methods(workshop_id);
create index payment_methods_active_idx on public.payment_methods(workshop_id, country, currency) where is_active;
create index registrations_workshop_id_idx on public.registrations(workshop_id);
create index registrations_status_idx on public.registrations(status);
create index payment_proofs_registration_id_idx on public.payment_proofs(registration_id);
