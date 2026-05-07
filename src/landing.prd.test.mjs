import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');

test('routing maps home and workshop pages', () => {
  const app = read('./App.tsx');
  const home = read('./pages/PesanCintaHomePage.tsx');
  const workshop = read('./pages/InnerCompassWorkshopPage.tsx');

  assert.match(app, /\/the-inner-compass-workshop/);
  assert.match(app, /<InnerCompassWorkshopPage \/>/);
  assert.match(app, /<PesanCintaHomePage \/>/);

  assert.match(home, /\/pesancinta\.png/);
  assert.match(home, /\/mimi\.png/);
  assert.match(home, /\/zai\.png/);
  assert.match(home, /\/startupglobal\.png/);
  assert.match(home, /We stand for a World where love leads, heals and connect us/);
  assert.match(home, /Mimi, Pesan Cinta founder/);
  assert.match(home, /Zai, Pesan Cinta founder/);
  assert.match(home, /The Inner Compass Workshop · 13-14 Juni 2026/);
  assert.match(home, /href="\/the-inner-compass-workshop"/);

  assert.match(workshop, /<LanguageSwitcher[\s\S]*<MobileFloatingCta[\s\S]*<Hero content=\{content\.hero\}[\s\S]*<EmpathySection content=\{content\.empathy\}[\s\S]*<WorkshopPillars content=\{content\.pillars\}[\s\S]*<PhotoProof content=\{content\.photoProof\}[\s\S]*<TrainerProfiles content=\{content\.trainers\}[\s\S]*<ContactFooter content=\{content\.footer\}/);
});

test('workshop landing page content matches simplified Batch 3 PRD', () => {
  const app = read('./App.tsx');
  const content = read('./content/landing.ts');
  const hero = read('./components/Hero.tsx');
  const footer = read('./components/ContactFooter.tsx');
  const mobileCta = read('./components/MobileFloatingCta.tsx');
  const empathy = read('./components/EmpathySection.tsx');
  const pillars = read('./components/WorkshopPillars.tsx');
  const trainers = read('./components/TrainerProfiles.tsx');
  const workshop = read('./pages/InnerCompassWorkshopPage.tsx');
  const switcher = read('./components/LanguageSwitcher.tsx');

  assert.match(content, /defaultWorkshopLocale = 'ms'/);
  assert.match(content, /workshopLocaleOrder = \['ms', 'id', 'en'\]/);
  assert.match(content, /Hidupmu,/);
  assert.match(content, /Kamu Navigatornya\./);
  assert.match(content, /Your life,/);
  assert.match(content, /you navigate it\./);
  assert.match(content, /Hanya 40 Kursi/);
  assert.match(content, /Hanya 40 Kerusi/);
  assert.match(content, /Only 40 Seats/);
  assert.match(hero, /content\.headlineLines/);
  assert.match(hero, /content\.ctaLabel/);

  assert.equal((content.match(/title: '/g) ?? []).length >= 12, true);
  assert.match(content, /Trainer Berpengalaman & Profesional/);
  assert.match(content, /Experienced & Professional Trainers/);
  assert.match(content, /Investment diinformasikan via WhatsApp/);
  assert.match(footer, /content\.investmentText/);
  assert.match(workshop, /localStorage\.getItem/);
  assert.match(workshop, /localStorage\.setItem/);
  assert.match(workshop, /try \{/);
  assert.match(switcher, /aria-pressed=\{isActive\}/);
  assert.match(switcher, /Switch language to/);
  assert.match(switcher, /aria-expanded=\{isOpen\}/);
  assert.match(switcher, /localeIcons/);
  assert.match(switcher, /isMobileVisible/);
  assert.match(workshop, /addEventListener\('scroll'/);
  assert.match(workshop, /setIsMobileSwitcherVisible\(false\)/);
  assert.match(mobileCta, /sm:hidden/);
  assert.match(mobileCta, /location="mobile-floating"/);
  assert.match(mobileCta, /isVisible/);
  assert.match(empathy, /key=\{index\}/);
  assert.match(pillars, /key=\{index\}/);
  assert.match(trainers, /key=\{index\}/);

  assert.equal(content.includes('export const registrationUrl'), false);
  assert.equal(content.includes('export const whyParagraphs'), false);
  assert.equal(content.includes('export const investmentText'), false);

  assert.equal(app.includes('EventDetails'), false);
  assert.equal(workshop.includes('EventDetails'), false);
});
