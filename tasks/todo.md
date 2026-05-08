# Todo: Pesan Cinta Workshop CMS MVP

## Phase 0: External setup and decisions

- [x] Prepare Supabase project and environment contract
  - Acceptance: `.env.example` documents URL/anon key; real `.env` stays untracked; README explains Supabase setup. Supabase project creation remains external owner action.
  - Verify: `npm run build`; `git status --short` shows no `.env` tracked.
  - Files: `.env.example`, `README.md`, `src/landing.prd.test.mjs`.

## Phase 1: Data foundation

- [x] Add Supabase schema migrations for workshops and payments
  - Acceptance: tables for workshops, locales, prices, payment methods, registrations, payment proofs; constraints for statuses/currencies/countries; unique slugs.
  - Verify: source migration test passes; remote migration apply remains pending until Supabase CLI/project workflow is used.
  - Files: `supabase/migrations/20260508000000_create_workshop_cms.sql`.

- [x] Add RLS policies and admin access model
  - Acceptance: RLS enabled; public can read published data and submit registration; owner admin can manage CMS; proofs access-controlled.
  - Verify: source RLS migration test passes; remote anonymous/admin smoke checks remain pending until migrations are applied.
  - Files: `supabase/migrations/20260508001000_add_workshop_cms_rls.sql`.

- [x] Add TypeScript domain types and Supabase client
  - Acceptance: Supabase client from env; typed workshop/registration/payment models; helpers isolate queries from UI.
  - Verify: `npm run build`; source tests cover client/type/helper presence.
  - Files: `src/lib/supabase.ts`, `src/lib/workshops.ts`, `src/lib/registrations.ts`, `src/types/*`, `src/vite-env.d.ts`.

## Phase 2: Admin shell and workshop CRUD

- [x] Add admin authentication and protected dashboard shell
  - Acceptance: unauthenticated users blocked; owner admin can sign in/out; admin layout has navigation; no protected-content flash.
  - Verify: source tests and `npm run build` pass; manual sign-in/out remains pending with Supabase admin user.
  - Files: `src/App.tsx`, `src/pages/admin/*`, `src/components/admin/AdminLayout.tsx`, `src/lib/auth.ts`.

- [x] Build workshop list and create/edit basics flow
  - Acceptance: list/create/edit/archive/publish workshops; slug unique; capacity positive; status managed. Manual CRUD remains pending with Supabase admin user.
  - Verify: source tests; `npm run build`; `npm run lint`.
  - Files: `src/pages/admin/WorkshopsPage.tsx`, `src/pages/admin/WorkshopEditorPage.tsx`, `src/components/admin/WorkshopBasicsForm.tsx`, `src/lib/workshops.ts`.

- [x] Add localized content editor for workshop pages
  - Acceptance: edit BM and ID content; EN optional; required default-locale content before publish; structured content saved. Manual save/reload remains pending with Supabase admin user.
  - Verify: source tests; `npm run build`; `npm run lint`.
  - Files: `src/components/admin/WorkshopContentForm.tsx`, `src/lib/workshops.ts`, `src/types/workshop.ts`.

## Phase 3: Pricing and manual payment setup

- [x] Add pricing and manual payment method forms
  - Acceptance: add MYR/IDR prices; add Malaysia/Indonesia bank transfer; QR image URL/instructions; activate/deactivate methods. Manual CRUD/upload smoke remains pending with Supabase admin user/storage.
  - Verify: source tests; `npm run build`; `npm run lint`.
  - Files: `src/components/admin/WorkshopPricingForm.tsx`, `src/components/admin/PaymentMethodsForm.tsx`, `src/lib/workshops.ts`, optional `src/lib/storage.ts`.

## Phase 4: Public CMS-driven workshop page and registration

- [x] Render public workshop page from CMS data
  - Acceptance: load published workshop by slug; draft/archived not public; show localized content, price, seats, active payment methods; current static route preserved. Manual slug checks remain pending with Supabase data.
  - Verify: source tests; `npm run build`; `npm run lint`.
  - Files: `src/pages/WorkshopPublicPage.tsx`, `src/App.tsx`, `src/lib/workshops.ts`, optional `src/components/workshop/*`.

- [x] Add registration form with capacity checks
  - Acceptance: capture name/email/phone/country/notes/workshop/payment method; validate fields; enforce capacity; show payment instructions after submit. Manual registration/full-capacity checks remain pending with Supabase data.
  - Verify: source tests; `npm run build`; `npm run lint`.
  - Files: `src/components/workshop/RegistrationForm.tsx`, `src/components/workshop/PaymentInstructions.tsx`, `src/lib/registrations.ts`, `src/types/registration.ts`.

- [ ] Add optional payment proof handling
  - Acceptance: proof upload can be enabled/disabled; upload stored access-controlled; status can move to `payment_submitted`.
  - Verify: manual upload/admin review; anonymous cannot list other proof files; `npm run build`.
  - Files: `src/components/workshop/PaymentProofUpload.tsx`, `src/lib/registrations.ts`, `src/lib/storage.ts`, `supabase/migrations/*.sql`.

## Phase 5: Admin registration management

- [ ] Build registration list and detail review
  - Acceptance: view registrations by workshop; filter status; open detail; update status; confirmed count updates capacity.
  - Verify: manual status transitions and over-capacity prevention; tests for status transitions; `npm run build && npm test`.
  - Files: `src/pages/admin/RegistrationsPage.tsx`, `src/pages/admin/RegistrationDetailPage.tsx`, `src/components/admin/RegistrationStatusSelect.tsx`, `src/lib/registrations.ts`.

- [ ] Add MVP notifications for registration and payment confirmation
  - Acceptance: provider decision documented; secrets server-side only; registration/payment notifications sent if enabled; failures do not corrupt status.
  - Verify: provider sandbox smoke test; `npm run build`.
  - Files: Supabase Edge Function/backend function files, optional `src/lib/notifications.ts`, `SPEC.md` if provider decision changes.

## Phase 6: Verification, migration, and launch hardening

- [ ] Seed/migrate current The Inner Compass content into CMS shape
  - Acceptance: current workshop represented in CMS data; BM/ID exist; EN optional; route remains usable; metadata/analytics no regression.
  - Verify: manual compare static vs CMS output; `npm run build && npm test && npm run lint`.
  - Files: `supabase/seed.sql` or migration seed file, optional bridge code.

- [ ] End-to-end QA and release checklist
  - Acceptance: auth blocks admin; anonymous cannot edit CMS; MY/ID registration works; capacity cannot be bypassed; existing pages work; metadata works.
  - Verify: `npm run build`; `npm test`; `npm run lint`; mobile/desktop browser checks; Supabase RLS smoke tests.
  - Files: `src/landing.prd.test.mjs`, release notes if needed.
