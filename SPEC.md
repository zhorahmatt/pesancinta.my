# Spec: Pesan Cinta Workshop CMS and Registration Platform

## Objective
Build an MVP dashboard for Pesan Cinta to manage multiple classes and workshops, starting from The Inner Compass Workshop. The platform should let admins create and manage workshops, publish landing pages, control participant capacity, configure accepted manual payment methods, and review participant registrations.

Target users:
- Pesan Cinta admins who manage workshops, schedules, capacity, pricing, and payment confirmation.
- Workshop prospects from Malaysia and Indonesia who view workshop pages and register.
- Future finance/operations users who reconcile manual payments and participant lists.

MVP success means Pesan Cinta can run multiple workshop pages from dashboard-managed data without editing source code for every new class.

## MVP Scope

### Admin Dashboard
- Admin can sign in securely.
- Admin can create, edit, archive, and publish workshops.
- Admin can configure workshop basics:
  - title
  - slug
  - description
  - date and time
  - venue and city/country
  - capacity
  - status: draft, published, archived
  - language content for Bahasa Malaysia and Bahasa Indonesia, with English prepared as optional expansion
- Admin can configure pricing:
  - currency: MYR or IDR
  - amount
  - early-bird amount if needed
  - payment deadline if needed
- Admin can configure accepted manual payment methods:
  - Malaysian bank transfer
  - Indonesian bank transfer
  - QRIS/manual QR upload or image reference
- Admin can view registrations for each workshop.
- Admin can update registration/payment status:
  - pending
  - awaiting_payment
  - payment_submitted
  - confirmed
  - cancelled
  - refunded
- Admin can manually confirm payment after checking proof.

### Public Workshop Pages
- Public pages can render workshop content from CMS data.
- Existing workshop visual style remains usable as first theme.
- Workshop pages support Malaysia and Indonesia market needs:
  - MYR and IDR currency display
  - localized copy
  - local transfer instructions
- Public page shows capacity or remaining seat messaging when enabled.
- Public page has registration CTA and form.

### Registration Flow
- Visitor can submit registration form with:
  - full name
  - email
  - phone number with country code
  - country
  - selected workshop
  - optional notes
- Visitor can choose available manual payment method.
- Visitor receives payment instructions after registering.
- Visitor can submit payment proof if enabled for MVP.
- System prevents confirmed registrations from exceeding capacity.

### Out of MVP
- Automatic payment gateway charge/callback.
- Complex seat waitlist automation.
- Multi-admin role hierarchy beyond basic admin.
- Certificate generation.
- Email marketing automation.
- Full no-code theme builder.
- Live visual page editor with side-panel copy controls.

## Future Full Platform Scope
After MVP, expand into a full workshop operating platform:
- Payment gateway integrations for Malaysia and Indonesia:
  - Malaysia candidates: Billplz, ToyyibPay, Stripe, FPX-supported providers.
  - Indonesia candidates: Midtrans, Xendit, Duitku, QRIS providers.
- Multi-currency payment gateway routing by country.
- Automated invoice/receipt generation.
- Automated email/WhatsApp notifications.
- Waitlist and seat release automation.
- Coupon, promo code, and affiliate tracking.
- Theme library for landing pages.
- Live landing page editor with side-panel controls for editing copy, section content, CTA labels, images, and visibility while previewing the page.
- Draft/preview/publish workflow for landing page edits so admins can review changes before making them public.
- Drag-and-drop page sections.
- Trainer/profile management.
- Media library for workshop images and share metadata.
- Analytics dashboard for traffic, conversion, registration, and revenue.
- Multi-country tax/receipt configuration.
- Role-based access control for admin, finance, content editor, and viewer.

## Tech Stack
Current project:
- React 19
- TypeScript
- Vite
- Tailwind CSS
- Node test runner
- ESLint
- Vercel deployment

MVP backend recommendation:
- Supabase Auth for admin authentication.
- Supabase Postgres for workshop, registration, payment method, and payment proof data.
- Supabase Storage for uploaded images and payment proof files.
- Supabase Row Level Security for data access protection.

Frontend approach:
- Keep current Vite React app for MVP if server-side rendering is not required.
- Add dashboard routes inside the existing app.
- Keep static route metadata for current public pages.
- Re-evaluate migration to Next.js if dynamic per-workshop social metadata becomes required for many CMS-created workshop pages.

## Commands
- Dev: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- Test: `npm test`
- Preview: `npm run preview`

## Project Structure
Current structure:
- `src/pages/` — route-level React pages.
- `src/components/` — shared and page-specific UI components.
- `src/content/` — static landing content and localization.
- `src/lib/` — shared utilities, tracking, URL helpers.
- `public/` — static assets.
- `index.html` — home page HTML and metadata.
- `the-inner-compass-workshop/index.html` — workshop route HTML and metadata.

Planned MVP additions:
- `src/pages/admin/` — admin dashboard pages.
- `src/components/admin/` — dashboard UI components.
- `src/lib/supabase.ts` — Supabase client.
- `src/lib/workshops.ts` — workshop data access helpers.
- `src/lib/registrations.ts` — registration data access helpers.
- `src/types/` — shared domain types.
- `supabase/migrations/` — database schema migrations.
- `supabase/policies/` — RLS policies if kept separately.

## Data Model

### workshops
- `id`
- `slug`
- `title`
- `status`
- `theme_key`
- `default_locale`
- `start_at`
- `end_at`
- `venue_name`
- `city`
- `country`
- `capacity`
- `show_remaining_seats`
- `created_at`
- `updated_at`

### workshop_locales
- `id`
- `workshop_id`
- `locale`
- `headline`
- `subheadline`
- `description`
- `cta_label`
- `sections_json`
- `registration_message`

### workshop_prices
- `id`
- `workshop_id`
- `currency`
- `amount`
- `early_bird_amount`
- `early_bird_ends_at`

### payment_methods
- `id`
- `workshop_id`
- `country`
- `type`
- `label`
- `currency`
- `instructions`
- `account_name`
- `account_number`
- `bank_name`
- `qr_image_url`
- `is_active`

### registrations
- `id`
- `workshop_id`
- `full_name`
- `email`
- `phone`
- `country`
- `locale`
- `payment_method_id`
- `status`
- `notes`
- `created_at`
- `updated_at`

### payment_proofs
- `id`
- `registration_id`
- `file_url`
- `submitted_at`
- `reviewed_at`
- `reviewed_by`
- `status`

## Code Style
Use typed domain objects and keep UI components presentational where possible. Data access should live in `src/lib/*` helpers rather than being scattered across components.

Example style:

```ts
export type WorkshopStatus = 'draft' | 'published' | 'archived';

export type Workshop = {
  id: string;
  slug: string;
  title: string;
  status: WorkshopStatus;
  capacity: number;
  country: 'MY' | 'ID' | string;
};
```

Component pattern:

```tsx
export function WorkshopCapacityBadge({ capacity, confirmedCount }: WorkshopCapacityBadgeProps) {
  const remainingSeats = capacity - confirmedCount;

  return <span>{remainingSeats} seats remaining</span>;
}
```

Guidelines:
- Prefer clear names over abbreviations.
- Keep dashboard forms split by domain: basics, content, pricing, payment, publishing.
- Validate external input at form/API/Supabase boundary.
- Do not hardcode future workshop content in React components once CMS data exists.
- Avoid adding payment gateway abstractions until at least one gateway is implemented.

## Testing Strategy
MVP tests should cover:
- Workshop CRUD helpers.
- Capacity calculation and overbooking prevention logic.
- Registration form validation.
- Payment status transitions.
- Route rendering for admin and public pages.
- Source tests for critical metadata and routing behavior.

Commands:
- Unit/source tests: `npm test`
- Build verification: `npm run build`
- Lint verification: `npm run lint`

Manual checks:
- Admin can sign in.
- Admin can create a draft workshop.
- Admin can publish a workshop.
- Public workshop page renders from stored data.
- Visitor can register.
- Admin can confirm payment manually.
- Capacity cannot exceed confirmed seat limit.

## Boundaries

### Always do
- Keep admin routes protected by authentication.
- Enable Supabase Row Level Security before production data is used.
- Validate registration inputs.
- Keep payment proof uploads private or access-controlled where possible.
- Run build, tests, and lint before release.
- Preserve current public landing page behavior while adding CMS features.

### Ask first
- Adding new paid third-party services.
- Migrating from Vite to Next.js.
- Adding a payment gateway.
- Changing deployment platform.
- Changing public route structure.
- Storing sensitive personal data beyond registration needs.

### Never do
- Store payment gateway secrets in frontend code.
- Disable RLS for production tables.
- Expose payment proof files publicly without approval.
- Auto-confirm payment without verified gateway callback or admin approval.
- Collect card data directly in this app.
- Commit `.env` files or credentials.

## Success Criteria
MVP is complete when:
- Admin can sign in and manage workshops from dashboard.
- Admin can configure Malaysia and Indonesia manual payment methods.
- Admin can set capacity and confirm registrations.
- Public workshop page can render from dashboard-managed data.
- Registration flow stores participant data and payment choice.
- Manual payment proof/status workflow works.
- Build, tests, and lint pass.
- Existing Pesan Cinta home and Inner Compass landing pages still work.

## Open Questions
- Should admin authentication allow only one owner account at first, or multiple admin users? start with one owner account first
- Should payment proof upload be required in MVP, or can admin confirm based on external bank checking only? can admin confirm based on external
- Should public workshop pages use `/workshops/:slug` for all future classes, or keep custom marketing routes like `/the-inner-compass-workshop/`? keep the current with custom marketing routes. let the user set the title and url slug
- Should English be required for every workshop at MVP, or optional per workshop? optional
- Which manual payment methods are required first for Malaysia and Indonesia?bank transfer and QR Code statis upload
- Should participant emails/WhatsApp notifications be sent automatically in MVP? if possible yes, implement emails/Whatsapp notification
