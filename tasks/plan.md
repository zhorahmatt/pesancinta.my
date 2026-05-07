# Implementation Plan: Inner Compass Workshop Localization

## Overview
Build BM / ID / EN localization for `InnerCompassWorkshopPage` with BM default and a visible language switcher. Locale selection persists in `localStorage`; no routes or i18n dependency are added.

## Dependency Graph
`src/content/landing.ts` locale contract
  → `InnerCompassWorkshopPage` locale state + selected content
  → section props (`Hero`, `EmpathySection`, `WorkshopPillars`, `PhotoProof`, `TrainerProfiles`, `ContactFooter`)
  → localized WhatsApp URLs
  → tests and manual browser verification

## Architecture Decisions
- Use typed static content in `src/content/landing.ts`, not a new dependency.
- Use locale keys `ms`, `id`, `en` and order `['ms', 'id', 'en']`.
- Keep images, contacts, and event constants shared unless text labels vary.
- Add a small `LanguageSwitcher` component for accessibility and reuse.
- Persist locale in `localStorage` behind a validity check; fallback to BM.

## Phase 1: Foundation

### Task 1: Create localized content contract
**Description:** Move visible workshop copy into a typed `workshopLocales` object while preserving current Indonesian copy under `id` and adding BM/EN drafts.

**Acceptance criteria:**
- [ ] `defaultWorkshopLocale = 'ms'` exists.
- [ ] `workshopLocaleOrder = ['ms', 'id', 'en']` exists.
- [ ] `workshopLocales.ms`, `.id`, and `.en` have matching content shape.
- [ ] Event/contact phone values stay unchanged.

**Verification:**
- [ ] `npm run build` reaches TypeScript check for missing fields.

**Dependencies:** None

**Files likely touched:**
- `src/content/landing.ts`

**Estimated scope:** M: 1 file, many copy fields

## Checkpoint: Content Foundation
- [ ] Content shape complete for BM / ID / EN.
- [ ] Shared image arrays still exported.

## Phase 2: Vertical localized render path

### Task 2: Add language state and switcher
**Description:** Add locale state to page, initialize from `localStorage`, persist changes, and render accessible BM / ID / EN switcher.

**Acceptance criteria:**
- [ ] BM is selected if `localStorage` is empty or invalid.
- [ ] Clicking BM / ID / EN changes locale without page reload.
- [ ] Refresh keeps selected locale.
- [ ] Active button has `aria-pressed="true"`.

**Verification:**
- [ ] Manual browser click/refresh test.
- [ ] `npm run build`.

**Dependencies:** Task 1

**Files likely touched:**
- `src/pages/InnerCompassWorkshopPage.tsx`
- `src/components/LanguageSwitcher.tsx`

**Estimated scope:** S: 2 files

### Task 3: Localize hero and CTA path
**Description:** Pass localized hero/event copy and locale-specific WhatsApp registration URL into `Hero`.

**Acceptance criteria:**
- [ ] Hero headline, eyebrow, subheadline, CTA label, badge, and event labels come from selected locale.
- [ ] Hero CTA WhatsApp message uses selected locale.
- [ ] Existing tracking location/target values unchanged.

**Verification:**
- [ ] Switch language manually and inspect hero text + CTA href.
- [ ] `npm run build`.

**Dependencies:** Tasks 1-2

**Files likely touched:**
- `src/pages/InnerCompassWorkshopPage.tsx`
- `src/components/Hero.tsx`
- `src/content/landing.ts`

**Estimated scope:** M: 3 files

### Task 4: Localize middle content sections
**Description:** Pass localized copy into empathy, benefits, photo proof, and trainer sections while keeping image behavior unchanged.

**Acceptance criteria:**
- [ ] `EmpathySection` text changes by locale.
- [ ] `WorkshopPillars` titles/descriptions change by locale and image mapping remains index-based.
- [ ] `PhotoProof` heading/subtext changes by locale and g1–g16 rotation remains intact.
- [ ] `TrainerProfiles` heading/subtext/trainer labels change by locale and trainer photos remain unchanged.

**Verification:**
- [ ] Manual switcher check for all four sections.
- [ ] `npm run build`.

**Dependencies:** Tasks 1-2

**Files likely touched:**
- `src/components/EmpathySection.tsx`
- `src/components/WorkshopPillars.tsx`
- `src/components/PhotoProof.tsx`
- `src/components/TrainerProfiles.tsx`
- `src/pages/InnerCompassWorkshopPage.tsx`

**Estimated scope:** M: 5 files

### Task 5: Localize footer and contact CTAs
**Description:** Pass localized footer copy and locale-specific WhatsApp message into `ContactFooter`.

**Acceptance criteria:**
- [ ] Footer heading, investment sentence, labels, organizer/sponsor text, and copyright text localize.
- [ ] Contact CTAs use selected locale WhatsApp message.
- [ ] Contact names/phone numbers unchanged.

**Verification:**
- [ ] Manual switcher check footer and CTA href.
- [ ] `npm run build`.

**Dependencies:** Tasks 1-2

**Files likely touched:**
- `src/components/ContactFooter.tsx`
- `src/pages/InnerCompassWorkshopPage.tsx`
- `src/content/landing.ts`

**Estimated scope:** M: 3 files

## Checkpoint: End-to-end localization
- [ ] BM default renders.
- [ ] ID and EN switch without reload.
- [ ] Refresh persists selected language.
- [ ] All page sections update copy.

## Phase 3: Verification

### Task 6: Update tests and run verification
**Description:** Update PRD tests to match localized component composition and assert locale coverage.

**Acceptance criteria:**
- [ ] Tests no longer expect old `<Hero />` composition if props are required.
- [ ] Tests verify BM default, ID availability, EN availability, and switcher/localStorage code path.
- [ ] Build and tests pass.

**Verification:**
- [ ] `npm run build`
- [ ] `npm test`
- [ ] `npm run lint`

**Dependencies:** Tasks 1-5

**Files likely touched:**
- `src/landing.prd.test.mjs`

**Estimated scope:** S: 1 file

## Risks and Mitigations
| Risk | Impact | Mitigation |
| --- | --- | --- |
| Long EN copy breaks layout | Medium | Manual check at 320/768/1024/1440; avoid `whitespace-nowrap` where copy can grow. |
| `localStorage` unavailable in SSR/test | Low | Access only inside browser-safe lazy state/effects; app is Vite client-only. |
| Translation tone feels off | Medium | Mark BM/EN drafts for human review after implementation. |
| Component prop changes break tests | Medium | Update tests after implementation; build catches missing props. |

## Open Questions
- Future shareable localized URL route/query remains out of scope.
- Native BM translation review remains recommended before launch.
