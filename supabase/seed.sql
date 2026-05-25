insert into auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) values (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'admin@pesancinta.my',
  extensions.crypt('PcAdmin-2026!vR7qM9xL', extensions.gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{}'::jsonb,
  false,
  '',
  '',
  '',
  ''
) on conflict (id) do update set
  email = excluded.email,
  encrypted_password = excluded.encrypted_password,
  email_confirmed_at = excluded.email_confirmed_at,
  updated_at = now();

insert into auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  last_sign_in_at,
  created_at,
  updated_at
) values (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '{"sub":"00000000-0000-0000-0000-000000000001","email":"admin@pesancinta.my"}'::jsonb,
  'email',
  'admin@pesancinta.my',
  now(),
  now(),
  now()
) on conflict (provider, provider_id) do nothing;

insert into public.admin_users (user_id)
values ('00000000-0000-0000-0000-000000000001')
on conflict (user_id) do nothing;

insert into public.workshops (
  slug,
  title,
  status,
  theme_key,
  default_locale,
  start_at,
  end_at,
  venue_name,
  city,
  country,
  capacity,
  show_remaining_seats
) values (
  'the-inner-compass-workshop',
  'The Inner Compass Workshop Batch 3 Makassar',
  'draft',
  'inner-compass',
  'ms',
  '2026-06-13 09:00:00+08',
  '2026-06-14 17:00:00+08',
  'Makassar venue',
  'Makassar',
  'ID',
  40,
  true
) on conflict (slug) do update set
  title = excluded.title,
  status = excluded.status,
  theme_key = excluded.theme_key,
  default_locale = excluded.default_locale,
  start_at = excluded.start_at,
  end_at = excluded.end_at,
  venue_name = excluded.venue_name,
  city = excluded.city,
  country = excluded.country,
  capacity = excluded.capacity,
  show_remaining_seats = excluded.show_remaining_seats;

with workshop as (
  select id from public.workshops where slug = 'the-inner-compass-workshop'
)
insert into public.workshop_locales (
  workshop_id,
  locale,
  headline,
  subheadline,
  description,
  cta_label,
  registration_message,
  sections_json
)
select
  workshop.id,
  locale,
  headline,
  subheadline,
  description,
  cta_label,
  registration_message,
  sections_json::jsonb
from workshop,
(values
  (
    'ms'::public.workshop_locale,
    'Hidupmu, Kamu Navigatornya.',
    'The Inner Compass Workshop untuk pulang ke kompas diri.',
    'Workshop reflektif untuk membantu peserta memahami arah hidup, pola emosi, dan keputusan dengan lebih sadar.',
    'Daftar via WhatsApp',
    'Saya ingin daftar The Inner Compass Workshop Batch 3.',
    '{"source":"current-static-inner-compass","languages":["ms","id"],"english_optional":true}'
  ),
  (
    'id'::public.workshop_locale,
    'Hidupmu, Kamu Navigatornya.',
    'The Inner Compass Workshop untuk kembali ke kompas diri.',
    'Workshop reflektif untuk membantu peserta memahami arah hidup, pola emosi, dan keputusan dengan lebih sadar.',
    'Daftar via WhatsApp',
    'Saya ingin daftar The Inner Compass Workshop Batch 3.',
    '{"source":"current-static-inner-compass","languages":["ms","id"],"english_optional":true}'
  )
) as content(locale, headline, subheadline, description, cta_label, registration_message, sections_json)
on conflict (workshop_id, locale) do update set
  headline = excluded.headline,
  subheadline = excluded.subheadline,
  description = excluded.description,
  cta_label = excluded.cta_label,
  registration_message = excluded.registration_message,
  sections_json = excluded.sections_json;

with workshop as (
  select id from public.workshops where slug = 'the-inner-compass-workshop'
)
insert into public.workshop_prices (workshop_id, currency, amount, early_bird_amount, early_bird_ends_at)
select workshop.id, currency, amount, null, null
from workshop,
(values
  ('MYR'::public.workshop_currency, 0),
  ('IDR'::public.workshop_currency, 0)
) as prices(currency, amount)
on conflict (workshop_id, currency) do update set
  amount = excluded.amount,
  early_bird_amount = excluded.early_bird_amount,
  early_bird_ends_at = excluded.early_bird_ends_at;

with workshop as (
  select id from public.workshops where slug = 'the-inner-compass-workshop'
)
insert into public.payment_methods (
  workshop_id,
  country,
  type,
  label,
  currency,
  instructions,
  account_name,
  account_number,
  bank_name,
  qr_image_url,
  is_active
)
select
  workshop.id,
  country,
  type,
  label,
  currency,
  instructions,
  account_name,
  account_number,
  bank_name,
  qr_image_url,
  false
from workshop,
(values
  ('MY'::public.workshop_country, 'bank_transfer'::public.payment_method_type, 'Malaysia bank transfer', 'MYR'::public.workshop_currency, 'Admin will update bank transfer instructions.', 'Pesan Cinta', 'UPDATE-MY-ACCOUNT', 'Update Malaysia bank name', null),
  ('ID'::public.workshop_country, 'bank_transfer'::public.payment_method_type, 'Indonesia bank transfer', 'IDR'::public.workshop_currency, 'Admin will update bank transfer instructions.', 'Pesan Cinta', 'UPDATE-ID-ACCOUNT', 'Update Indonesia bank name', null),
  ('ID'::public.workshop_country, 'static_qr'::public.payment_method_type, 'QRIS static QR', 'IDR'::public.workshop_currency, 'Admin will upload QR image or enter QR instructions.', null, null, null, '/g17.jpeg')
) as methods(country, type, label, currency, instructions, account_name, account_number, bank_name, qr_image_url);
