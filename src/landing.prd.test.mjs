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
  assert.match(home, /Mimi &amp; Zai/);
  assert.match(home, /The Inner Compass Workshop · 13-14 Juni 2026/);
  assert.match(home, /href="\/the-inner-compass-workshop"/);

  assert.match(workshop, /<Hero \/>[\s\S]*<EmpathySection \/>[\s\S]*<WorkshopPillars \/>[\s\S]*<PhotoProof \/>[\s\S]*<TrainerProfiles \/>[\s\S]*<ContactFooter \/>/);
});

test('workshop landing page content matches simplified Batch 3 PRD', () => {
  const app = read('./App.tsx');
  const content = read('./content/landing.ts');
  const hero = read('./components/Hero.tsx');
  const footer = read('./components/ContactFooter.tsx');
  const workshop = read('./pages/InnerCompassWorkshopPage.tsx');

  assert.match(content, /Berapa lama lagi mau bertahan seperti ini\?/);
  assert.match(content, /Ruang aman untuk refleksi & penyembuhan diri/);
  assert.match(content, /13-14 Juni 2026 \| Toraja D, Four Points/);
  assert.match(content, /Hanya 40 Kursi/);
  assert.match(content, /Amankan Kursi Saya/);
  assert.match(hero, /Hidupmu,/);
  assert.match(hero, /Kamu Navigatornya\./);
  assert.match(hero, /hero\.ctaLabel/);

  assert.equal((content.match(/title: '/g) ?? []).length >= 4, true);
  assert.match(content, /Trainer Berpengalaman & Profesional/);
  assert.match(content, /Investment diinformasikan via WhatsApp/);
  assert.match(footer, /investmentText/);

  assert.equal(app.includes('EventDetails'), false);
  assert.equal(workshop.includes('EventDetails'), false);
});
