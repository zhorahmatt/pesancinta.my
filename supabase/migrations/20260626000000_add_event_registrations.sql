-- Allow registrations that are not tied to a CMS workshop row, identified by a
-- free-form event key instead (e.g. the static "inner-compass" landing page).
-- The backend can then handle multiple events by name.

alter table public.registrations
  alter column workshop_id drop not null;

alter table public.registrations
  add column if not exists event_key text;

create index if not exists registrations_event_key_idx on public.registrations(event_key);

-- Keep data sane: a registration must reference either a workshop or an event key.
alter table public.registrations
  drop constraint if exists registrations_workshop_or_event_present;

alter table public.registrations
  add constraint registrations_workshop_or_event_present
  check (workshop_id is not null or event_key is not null);
