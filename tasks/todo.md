# Todo: Inner Compass Workshop Localization

- [ ] Create localized content contract
  - Acceptance: BM default, ID second, EN third; matching content shape; contacts/event values unchanged.
  - Verify: `npm run build`
  - Files: `src/content/landing.ts`

- [ ] Add visible language switcher
  - Acceptance: BM / ID / EN buttons in order; active state accessible; click changes copy; refresh persists via `localStorage`.
  - Verify: browser click/refresh + `npm run build`
  - Files: `src/pages/InnerCompassWorkshopPage.tsx`, `src/components/LanguageSwitcher.tsx`

- [ ] Localize hero and CTA path
  - Acceptance: hero copy and event labels use selected locale; hero WhatsApp message uses selected locale; tracking unchanged.
  - Verify: browser CTA href inspection + `npm run build`
  - Files: `src/pages/InnerCompassWorkshopPage.tsx`, `src/components/Hero.tsx`, `src/content/landing.ts`

- [ ] Localize middle content sections
  - Acceptance: empathy, pillars, photo proof, trainers update with selected locale; image behavior unchanged.
  - Verify: browser switcher check + `npm run build`
  - Files: `src/components/EmpathySection.tsx`, `src/components/WorkshopPillars.tsx`, `src/components/PhotoProof.tsx`, `src/components/TrainerProfiles.tsx`, `src/pages/InnerCompassWorkshopPage.tsx`

- [ ] Localize footer and contact CTAs
  - Acceptance: footer copy localizes; contact CTA WhatsApp message uses selected locale; contact data unchanged.
  - Verify: browser footer/CTA href check + `npm run build`
  - Files: `src/components/ContactFooter.tsx`, `src/pages/InnerCompassWorkshopPage.tsx`, `src/content/landing.ts`

- [ ] Update tests and run verification
  - Acceptance: tests assert locale coverage and updated page composition; build/test/lint pass.
  - Verify: `npm run build && npm test && npm run lint`
  - Files: `src/landing.prd.test.mjs`
