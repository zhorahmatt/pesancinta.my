# Implementation Plan: Pesan Cinta Workshop CMS MVP

## Overview
Build an MVP CMS/dashboard for Pesan Cinta to manage multiple workshops with Supabase-backed data, one-owner admin auth, manual payment methods for Malaysia and Indonesia, registration management, and CMS-driven public workshop pages. Keep the existing landing pages working while adding the admin and registration foundation.

## Dependency Graph

```text
Supabase project + env config
  → database schema + RLS policies
    → typed domain models + Supabase client
      → admin auth gate
        → workshop CRUD dashboard
          → pricing + manual payment configuration
          → public workshop render from CMS data
            → registration form + capacity checks
              → admin registration/payment review
                → notification hooks
                  → verification + launch hardening
```

## Architecture Decisions
- Use Supabase Auth, Postgres, Storage, and RLS for MVP.
- Start with one owner/admin account; no multi-role admin system in MVP.
- Keep Vite React app for MVP; revisit Next.js only when dynamic per-workshop social metadata becomes blocking.
- Use custom marketing slugs/routes; admin sets page title and URL slug.
- Start payment with manual bank transfer and static QR upload for Malaysia and Indonesia.
- Admin confirms payment based on external bank/QR checking; payment proof upload remains optional.
- English content is optional per workshop.
- Email/WhatsApp notifications are included if feasible through provider choice and safe credentials handling.
- Full live visual landing editor remains future scope; MVP uses structured content forms.

## Phase 0: External setup and decisions

### Task 1: Prepare Supabase project and environment contract
**Status:** Repo-side setup complete; Supabase project creation remains external owner action.

**Description:** Create Supabase project, define environment variables, and document required keys without committing secrets.

**Acceptance criteria:**
- [x] `.env.example` documents required public Supabase URL and anon key.
- [x] Real `.env` remains uncommitted.
- [x] README references local setup.
- [ ] Supabase project exists.

**Verification:**
- [x] `npm run build` still passes without secrets committed.
- [x] `git status --short` shows no `.env` file staged/tracked.

**Dependencies:** None

**Files likely touched:**
- `.env.example`
- `README.md`
- `SPEC.md` if setup decisions change

**Estimated scope:** S

## Checkpoint: Project setup
- [ ] Supabase project ready.
- [ ] Secret handling confirmed.
- [ ] Environment contract documented.

## Phase 1: Data foundation

### Task 2: Add Supabase schema migrations for workshops and payments
**Description:** Add database schema for workshops, localized content, pricing, payment methods, registrations, and payment proofs.

**Acceptance criteria:**
- [ ] Tables exist: `workshops`, `workshop_locales`, `workshop_prices`, `payment_methods`, `registrations`, `payment_proofs`.
- [ ] Enum/check constraints cover statuses, currencies, countries, and payment method types.
- [ ] Slugs are unique.
- [ ] Foreign keys cascade or restrict intentionally.
- [ ] Timestamps exist for auditable rows.

**Verification:**
- [ ] Migration applies cleanly in Supabase local/remote environment.
- [ ] Basic insert/select smoke check passes.

**Dependencies:** Task 1

**Files likely touched:**
- `supabase/migrations/*.sql`

**Estimated scope:** M

### Task 3: Add RLS policies and admin access model
**Description:** Enable RLS and define policies so public users can read published workshop data and submit registrations, while only the owner admin can manage CMS data.

**Acceptance criteria:**
- [ ] RLS enabled on all Supabase tables.
- [ ] Public read allowed only for published workshop content and active payment methods.
- [ ] Public insert allowed for registrations with validated fields.
- [ ] Admin can CRUD workshops, locales, prices, payment methods, registrations, and payment proofs.
- [ ] Payment proof access is private/access-controlled.

**Verification:**
- [ ] Anonymous client cannot edit workshop/admin data.
- [ ] Authenticated owner can manage data.
- [ ] Anonymous visitor can register only through allowed insert policy.

**Dependencies:** Task 2

**Files likely touched:**
- `supabase/migrations/*.sql`
- `supabase/policies/*` if policies are split out

**Estimated scope:** M

### Task 4: Add TypeScript domain types and Supabase client
**Description:** Add typed domain models, Supabase client setup, and data-access helpers for workshops, payment methods, and registrations.

**Acceptance criteria:**
- [ ] `src/lib/supabase.ts` initializes client from env vars.
- [ ] Shared types cover workshop status, registration status, currencies, countries, locales, and payment method types.
- [ ] Data helpers isolate Supabase queries from UI components.
- [ ] Helpers return typed results and clear error objects.

**Verification:**
- [ ] `npm run build` passes.
- [ ] Unit/source tests cover status/capacity helper behavior where possible.

**Dependencies:** Tasks 2-3

**Files likely touched:**
- `src/lib/supabase.ts`
- `src/lib/workshops.ts`
- `src/lib/registrations.ts`
- `src/types/workshop.ts`
- `src/types/registration.ts`

**Estimated scope:** M

## Checkpoint: Data foundation
- [ ] Migrations exist and apply.
- [ ] RLS protects tables.
- [ ] App can query Supabase through typed helpers.

## Phase 2: Admin shell and workshop CRUD

### Task 5: Add admin authentication and protected dashboard shell
**Description:** Add `/admin` sign-in and protected dashboard layout for one owner account.

**Acceptance criteria:**
- [ ] Unauthenticated users cannot access dashboard pages.
- [ ] Admin can sign in and sign out.
- [ ] Dashboard shell has navigation for Workshops, Registrations, and Settings/Payments placeholders.
- [ ] Auth state loading does not flash protected content.

**Verification:**
- [ ] Manual sign-in/out check.
- [ ] Direct `/admin` access redirects or shows sign-in.
- [ ] `npm run build` passes.

**Dependencies:** Task 4

**Files likely touched:**
- `src/App.tsx`
- `src/pages/admin/AdminLoginPage.tsx`
- `src/pages/admin/AdminDashboardPage.tsx`
- `src/components/admin/AdminLayout.tsx`
- `src/lib/auth.ts`

**Estimated scope:** M

### Task 6: Build workshop list and create/edit basics flow
**Description:** Let admin list workshops and create/edit core workshop basics: title, slug, status, date/time, venue, city/country, capacity, default locale, and remaining seat visibility.

**Acceptance criteria:**
- [ ] Admin can view workshop list.
- [ ] Admin can create draft workshop.
- [ ] Admin can edit workshop basics.
- [ ] Slug is required and unique.
- [ ] Capacity must be positive.
- [ ] Workshop can be draft, published, or archived.

**Verification:**
- [ ] Manual create/edit/archive/publish check.
- [ ] Tests cover validation helpers for slug/capacity/status.
- [ ] `npm run build && npm test` passes.

**Dependencies:** Task 5

**Files likely touched:**
- `src/pages/admin/WorkshopsPage.tsx`
- `src/pages/admin/WorkshopEditorPage.tsx`
- `src/components/admin/WorkshopBasicsForm.tsx`
- `src/lib/workshops.ts`

**Estimated scope:** M

### Task 7: Add localized content editor for workshop pages
**Description:** Add structured content forms for Bahasa Malaysia, Bahasa Indonesia, and optional English without implementing full live visual editor.

**Acceptance criteria:**
- [ ] Admin can edit BM and ID content for a workshop.
- [ ] EN content can be added or left empty.
- [ ] Fields cover headline, subheadline, description, CTA label, registration message, and section JSON/content.
- [ ] Validation prevents publishing without required default-locale content.
- [ ] Existing The Inner Compass content can be seeded/migrated into this shape later.

**Verification:**
- [ ] Manual save/reload content check.
- [ ] `npm run build` passes.

**Dependencies:** Task 6

**Files likely touched:**
- `src/components/admin/WorkshopContentForm.tsx`
- `src/lib/workshops.ts`
- `src/types/workshop.ts`

**Estimated scope:** M

## Checkpoint: Admin workshop management
- [ ] Admin can sign in.
- [ ] Admin can create and publish workshop records.
- [ ] Admin can manage localized content.

## Phase 3: Pricing and manual payment setup

### Task 8: Add pricing and manual payment method forms
**Description:** Let admin configure MYR/IDR pricing, bank transfer details, and static QR image/manual QR instructions per workshop.

**Acceptance criteria:**
- [ ] Admin can add/edit MYR and IDR prices.
- [ ] Admin can add bank transfer method for Malaysia and Indonesia.
- [ ] Admin can upload/select static QR image or enter QR instructions.
- [ ] Admin can activate/deactivate payment methods.
- [ ] Public users only see active methods relevant to selected country/currency.

**Verification:**
- [ ] Manual create/edit/deactivate payment methods.
- [ ] Upload smoke check if QR image upload is implemented in this task.
- [ ] `npm run build` passes.

**Dependencies:** Task 6

**Files likely touched:**
- `src/components/admin/WorkshopPricingForm.tsx`
- `src/components/admin/PaymentMethodsForm.tsx`
- `src/lib/workshops.ts`
- `src/lib/storage.ts` if upload added

**Estimated scope:** M

## Checkpoint: Sellable workshop setup
- [ ] Published workshop has content, price, capacity, and payment methods.
- [ ] Admin can update payment instructions without code change.

## Phase 4: Public CMS-driven workshop page and registration

### Task 9: Render public workshop page from CMS data
**Description:** Add public workshop route rendering from Supabase data while preserving current custom marketing route strategy.

**Acceptance criteria:**
- [ ] Public page can load published workshop by slug.
- [ ] Draft/archived workshops do not render as public registration pages.
- [ ] Page shows localized content, price, capacity/remaining seats if enabled, and active payment methods.
- [ ] Existing `/the-inner-compass-workshop/` page behavior is preserved until CMS migration is explicitly enabled.

**Verification:**
- [ ] Manual load published and draft slugs.
- [ ] `npm run build` passes.

**Dependencies:** Tasks 6-8

**Files likely touched:**
- `src/pages/WorkshopPublicPage.tsx`
- `src/App.tsx`
- `src/lib/workshops.ts`
- `src/components/workshop/*` if created

**Estimated scope:** M

### Task 10: Add registration form with capacity checks
**Description:** Let visitors register for a workshop, select country/payment method, and receive manual payment instructions.

**Acceptance criteria:**
- [ ] Registration form captures full name, email, phone with country code, country, notes, selected workshop, and selected payment method.
- [ ] Form validates required fields and email/phone basics.
- [ ] Confirmed registrations cannot exceed capacity.
- [ ] New registration status starts as `awaiting_payment` or `pending` by chosen workflow.
- [ ] Visitor sees selected payment instructions after submit.

**Verification:**
- [ ] Manual registration happy path.
- [ ] Manual capacity-full case.
- [ ] Tests cover capacity helper and form validation helpers.
- [ ] `npm run build && npm test` passes.

**Dependencies:** Task 9

**Files likely touched:**
- `src/components/workshop/RegistrationForm.tsx`
- `src/components/workshop/PaymentInstructions.tsx`
- `src/lib/registrations.ts`
- `src/types/registration.ts`

**Estimated scope:** M

### Task 11: Add optional payment proof handling
**Description:** If enabled for MVP, let visitors upload payment proof or let admin confirm from external bank check only.

**Acceptance criteria:**
- [ ] Admin can choose whether proof upload is required/visible per workshop or payment method.
- [ ] Visitor can upload proof only when enabled.
- [ ] Upload goes to Supabase Storage with access-controlled path.
- [ ] Registration status can move to `payment_submitted` after proof upload.

**Verification:**
- [ ] Manual upload and admin review check.
- [ ] Anonymous users cannot list other proof files.
- [ ] `npm run build` passes.

**Dependencies:** Task 10

**Files likely touched:**
- `src/components/workshop/PaymentProofUpload.tsx`
- `src/lib/registrations.ts`
- `src/lib/storage.ts`
- `supabase/migrations/*.sql` if storage policy needed

**Estimated scope:** M

## Checkpoint: Visitor registration flow
- [ ] Public workshop renders from CMS data.
- [ ] Visitor can register.
- [ ] Visitor receives manual payment instructions.
- [ ] Capacity limit is enforced.

## Phase 5: Admin registration management

### Task 12: Build registration list and detail review
**Description:** Let admin view registrations per workshop, filter by status, inspect payment method/proof, and update status.

**Acceptance criteria:**
- [ ] Admin can view all registrations per workshop.
- [ ] Admin can filter by status.
- [ ] Admin can open registration detail.
- [ ] Admin can mark payment as confirmed, cancelled, refunded, or pending.
- [ ] Confirmed count updates capacity/remaining seat calculations.

**Verification:**
- [ ] Manual status transition check.
- [ ] Manual over-capacity prevention check.
- [ ] Tests cover valid/invalid status transitions where implemented.
- [ ] `npm run build && npm test` passes.

**Dependencies:** Tasks 10-11

**Files likely touched:**
- `src/pages/admin/RegistrationsPage.tsx`
- `src/pages/admin/RegistrationDetailPage.tsx`
- `src/components/admin/RegistrationStatusSelect.tsx`
- `src/lib/registrations.ts`

**Estimated scope:** M

### Task 13: Add MVP notifications for registration and payment confirmation
**Description:** Add notification hooks for email/WhatsApp if provider choice is feasible and credentials are kept server-side.

**Acceptance criteria:**
- [ ] Provider decision documented before implementation.
- [ ] No provider secret is stored in frontend code.
- [ ] Visitor receives registration/payment instructions if email notification is enabled.
- [ ] Visitor receives confirmation notification when admin confirms payment if enabled.
- [ ] Failure to send notification does not corrupt registration/payment status.

**Verification:**
- [ ] Manual notification smoke test in provider sandbox/test mode.
- [ ] `npm run build` passes.

**Dependencies:** Task 12

**Files likely touched:**
- Supabase Edge Function or chosen backend function files
- `src/lib/notifications.ts` if client trigger helper is needed
- `SPEC.md` if provider decision changes scope

**Estimated scope:** M/L depending provider

## Checkpoint: Operations workflow
- [ ] Admin can manage incoming registrations.
- [ ] Admin can confirm manual payment.
- [ ] Notification path is either implemented or explicitly deferred with provider decision.

## Phase 6: Verification, migration, and launch hardening

### Task 14: Seed/migrate current The Inner Compass content into CMS shape
**Description:** Add seed data or migration path for the current Inner Compass workshop so CMS can reproduce the existing page content and payment setup.

**Acceptance criteria:**
- [ ] Existing workshop details are represented in CMS data shape.
- [ ] BM and ID content exist; EN optional.
- [ ] Current route remains usable.
- [ ] No existing social metadata/analytics regression.

**Verification:**
- [ ] Manual compare current static page and CMS data output.
- [ ] `npm run build && npm test && npm run lint` passes.

**Dependencies:** Tasks 9-12

**Files likely touched:**
- `supabase/seed.sql` or migration seed file
- `src/content/landing.ts` only if bridge/migration requires it

**Estimated scope:** M

### Task 15: End-to-end QA and release checklist
**Description:** Validate full admin-to-registration flow, security boundaries, mobile UI, and deployment behavior.

**Acceptance criteria:**
- [ ] Build/test/lint pass.
- [ ] Admin auth blocks public access.
- [ ] Anonymous user cannot edit CMS data.
- [ ] Registration works for Malaysia and Indonesia payment methods.
- [ ] Capacity limit cannot be bypassed through UI.
- [ ] Existing home page and static Inner Compass page still work.
- [ ] Social metadata still works for existing routes.

**Verification:**
- [ ] `npm run build`
- [ ] `npm test`
- [ ] `npm run lint`
- [ ] Manual browser checks at mobile and desktop sizes.
- [ ] Supabase RLS smoke tests.

**Dependencies:** Tasks 1-14

**Files likely touched:**
- `src/landing.prd.test.mjs`
- QA notes in PR/release checklist if needed

**Estimated scope:** S/M

## Risks and Mitigations
| Risk | Impact | Mitigation |
| --- | --- | --- |
| Vite SPA cannot provide dynamic social metadata for many CMS slugs | High later | Keep current custom routes in MVP; evaluate Next.js/prerender before scaling dynamic public pages. |
| RLS misconfiguration exposes registrations or payment proofs | High | Write policies early, smoke-test anonymous vs admin access, keep proof files private/access-controlled. |
| Manual capacity check race condition overbooks seats | High | Enforce capacity in database transaction/RPC, not only UI. |
| Payment proof files expose private data | Medium/High | Store in private bucket or signed URLs; do not expose public list access. |
| Notification provider adds scope/secret complexity | Medium | Treat notifications as provider-gated; implement via server-side function only. |
| CMS scope grows into full visual builder | Medium | Keep MVP structured forms; leave live visual editor in future roadmap. |
| Malaysia/Indonesia payment/account requirements differ | Medium | Model country/currency/payment methods separately from workshop core. |

## Open Questions Before Build
- Which Supabase project should be used, and who owns the owner admin account? me as the owner project and just asked what should i filled in the project to setup
- Which email provider should be used for MVP notifications? i have my own services, that ready to connect
- Which WhatsApp notification path is acceptable: official WhatsApp Business API, third-party provider, or manual WhatsApp link only? just use whatsapp link send with wa.me followed with the message
- Should payment proof upload be enabled in MVP, or hidden until operations need it? make it optional payment proof as long as the admin approve, it is ok
- Should CMS-driven public pages launch under `/classes/:slug`, `/workshops/:slug`, or only custom marketing slugs set per workshop?
