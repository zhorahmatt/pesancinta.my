# Spec: Inner Compass Workshop Localization

## Objective
Add localization support for `InnerCompassWorkshopPage` so the full workshop landing page can render Bahasa Malaysia (default), Bahasa Indonesia (second language), and English (third language) from a structured content source.

Target users are workshop prospects in Malaysia-facing, Indonesia-facing, and English-speaking contexts. Success means visitors can choose language from a visible switcher, with Bahasa Malaysia used as the default content.

Acceptance criteria:
- Bahasa Malaysia is the default workshop page copy.
- Bahasa Indonesia copy remains available as the second language.
- English copy exists as the third language.
- A visible language switcher is available from the first implementation.
- Language selection updates all visible workshop page sections without reload.
- All text rendered by `Hero`, `EmpathySection`, `WorkshopPillars`, `PhotoProof`, `TrainerProfiles`, and `ContactFooter` comes from localized content where applicable.
- Existing layout, animations, images, tracking, and WhatsApp CTA behavior keep working.

## Tech Stack
- React 19.2.1
- TypeScript 5.9.3
- Vite 6.4.2
- Tailwind CSS 4.1.17
- Node test runner via `node --test`

## Commands
- Dev: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- Test: `npm test`
- Preview: `npm run preview`

## Project Structure
- `src/pages/InnerCompassWorkshopPage.tsx` — workshop page composition and reveal observer.
- `src/components/` — presentational workshop sections.
- `src/content/landing.ts` — current shared landing content; localization data should live here or beside it.
- `src/lib/whatsapp.ts` — WhatsApp URL helper.
- `src/landing.prd.test.mjs` — production behavior tests.
- `src/styles.css` — global theme, animations, reveal effects.

Planned structure:
- Keep localization content in `src/content/landing.ts` unless it becomes too large.
- Export a `workshopLocales` object keyed by locale code, plus `defaultWorkshopLocale = 'ms'`.
- Keep image arrays shared when images do not vary by locale.

## Code Style
Use typed content objects and pass the selected locale content down as props. Keep components presentational and avoid adding global state until a visible language switcher exists.

Example target style:

```ts
export const defaultWorkshopLocale = 'ms';

export const workshopLocales = {
  ms: {
    label: 'BM',
    hero: {
      eyebrow: 'The Inner Compass Workshop Batch 3 - Makassar',
      headline: 'Berapa lama lagi mahu bertahan begini?',
    },
  },
  id: {
    label: 'ID',
    hero: {
      eyebrow: 'The Inner Compass Workshop Batch 3 - Makassar',
      headline: 'Berapa lama lagi mau bertahan seperti ini?',
    },
  },
  en: {
    label: 'EN',
    hero: {
      eyebrow: 'The Inner Compass Workshop Batch 3 - Makassar',
      headline: 'How much longer will you keep carrying this?',
    },
  },
} as const;

export type WorkshopLocale = keyof typeof workshopLocales;
```

Component usage:

```tsx
const content = workshopLocales[defaultWorkshopLocale];

<LanguageSwitcher locale={locale} locales={workshopLocales} onChange={setLocale} />
<Hero content={content.hero} registrationUrl={registrationUrl} />
```

Conventions:
- Use `ms` for Bahasa Malaysia, `id` for Bahasa Indonesia, and `en` for English.
- Keep locale order as BM, ID, EN in the switcher.
- Keep static image paths outside translation copy unless locale-specific.
- No i18n dependency for this iteration.
- Use local React state for switcher and persist selected locale in `localStorage`; no URL routing yet.

## Testing Strategy
- Run `npm run build` for TypeScript and production bundle verification.
- Run `npm run lint` for code quality if current project lint is configured cleanly.
- Run `npm test` and update tests if they assert Indonesian copy.
- Manual browser verification at 320px, 768px, 1024px, and 1440px because text length changes can break layout.

Expected test updates:
- Replace current Indonesian default expectations with Bahasa Malaysia defaults.
- Add assertions that Bahasa Indonesia and English locale content exists for key sections if tests are content-aware.
- Add or update tests for the language switcher if component testing support exists; otherwise rely on build plus manual browser verification.

## Boundaries
- Always: Keep Bahasa Malaysia as default for this page.
- Always: Keep Bahasa Indonesia as the second language option.
- Always: Keep English as the third language option.
- Always: Include a visible language switcher in the first implementation.
- Always: Keep all three translations complete for every visible workshop page text.
- Always: Preserve existing layout, images, animations, and CTA tracking behavior.
- Always: Run `npm run build` before calling implementation done.
- Ask first: Add a localization library such as i18next or react-intl.
- Ask first: Add URL routes like `/ms/...`, `/id/...`, or `/en/...`.
- Ask first: Change event details, dates, venue, capacity, or contact names/phone numbers.
- Never: Remove current page sections to simplify localization.
- Never: Commit generated translations as final marketing copy without user review if wording is sensitive.
- Never: Change WhatsApp phone numbers or tracking event names without approval.

## Success Criteria
- `InnerCompassWorkshopPage` renders Bahasa Malaysia by default.
- Bahasa Indonesia and English copy are available in code for the full page.
- A visible BM / ID / EN switcher updates the page copy without reload.
- Components receive copy via props or a clearly typed content object instead of importing only one language’s strings.
- Removed or replaced single-language content exports no longer cause dead code.
- `npm run build` passes.
- Manual browser check confirms no text overflow or broken responsive layout.

## Implementation Plan
1. Inventory content usage
   - Read all workshop page components and list every text source from `src/content/landing.ts` and inline component text.
   - Identify shared non-localized values: image groups, contacts, event date/time, registration URL behavior.

2. Reshape content model
   - Add `defaultWorkshopLocale = 'ms'`, `workshopLocaleOrder = ['ms', 'id', 'en']`, and `workshopLocales` to `src/content/landing.ts`.
   - Move workshop copy into locale-specific sections: `hero`, `whyParagraphs`, `pillars`, `photoProof`, `trainers`, `contactFooter`, `registrationMessage`, and any event labels.
   - Preserve current Indonesian copy under `id` before drafting BM and EN variants.
   - Keep image arrays like `proofPhotoGroups` and benefit image naming shared.

3. Add language switcher
   - Create a small `LanguageSwitcher` component or local markup in the page.
   - Render BM / ID / EN in that order.
   - Use accessible buttons with `aria-pressed` and clear focus states.
   - Keep selection in local React state and persist it to `localStorage`.

4. Update page composition
   - In `InnerCompassWorkshopPage`, initialize locale from `localStorage` when valid, otherwise `defaultWorkshopLocale`.
   - Select `const content = workshopLocales[locale]`.
   - Persist locale changes back to `localStorage`.
   - Render the switcher and pass localized content to each section component.
   - Keep reveal observer unchanged.

5. Update components incrementally
   - `Hero`: accept localized hero/event/CTA copy and registration URL.
   - `EmpathySection`: accept localized paragraphs.
   - `WorkshopPillars`: accept localized pillars while keeping benefit images mapped by index.
   - `PhotoProof`: accept localized heading/subtext while keeping `proofPhotoGroups` shared.
   - `TrainerProfiles`: accept localized trainer content.
   - `ContactFooter`: accept localized labels, CTA copy, and contact/event display text.

6. Update WhatsApp URL creation
   - Generate registration URL from the currently selected locale’s registration message.
   - Preserve current contact phone behavior.

7. Update tests
   - Update content expectations from Indonesian default to Bahasa Malaysia default.
   - Add coverage that Bahasa Indonesia and English locale shapes are complete if existing tests support it.

8. Verify
   - Run `npm run build`.
   - Run `npm test`.
   - Run `npm run lint` if lint was already passing or fix lint issues introduced by this work.
   - Manually inspect page responsive behavior in BM, ID, and EN, especially long English headings and CTA/footer copy.

## Task Breakdown
- [ ] Task: Map all visible copy in workshop page
  - Acceptance: Every visible string source is accounted for.
  - Verify: Compare component text against `InnerCompassWorkshopPage` section list.
  - Files: `src/components/*.tsx`, `src/content/landing.ts`

- [ ] Task: Create typed locale content
  - Acceptance: `ms`, `id`, and `en` contain complete matching content shape; BM is default.
  - Verify: TypeScript catches missing fields via `as const`/types.
  - Files: `src/content/landing.ts`

- [ ] Task: Add visible language switcher
  - Acceptance: BM / ID / EN buttons render in order, current locale is visually and semantically active, clicking changes locale without reload, and refresh keeps the selected locale via `localStorage`.
  - Verify: Manual browser click/refresh test plus `npm run build`.
  - Files: `src/pages/InnerCompassWorkshopPage.tsx` or `src/components/LanguageSwitcher.tsx`

- [ ] Task: Pass localized content through page and components
  - Acceptance: Workshop components no longer depend on single-language exports for visible copy.
  - Verify: `npm run build`
  - Files: `src/pages/InnerCompassWorkshopPage.tsx`, `src/components/*.tsx`

- [ ] Task: Localize registration message and footer CTA copy
  - Acceptance: WhatsApp URL uses selected locale message; contacts unchanged.
  - Verify: Inspect generated CTA URL behavior in browser or unit test.
  - Files: `src/content/landing.ts`, `src/components/ContactFooter.tsx`, `src/components/Hero.tsx`

- [ ] Task: Update tests and run verification
  - Acceptance: Build and tests pass; locale content completeness covered where practical.
  - Verify: `npm run build && npm test`
  - Files: `src/landing.prd.test.mjs`

## Open Questions
- Should future locale selection use URL route or query param for shareable localized links?
- Should translations be reviewed by a native Bahasa Malaysia speaker before launch?
