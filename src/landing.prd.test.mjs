import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');

test('landing page content matches simplified Batch 3 PRD', () => {
  const app = read('./App.tsx');
  const content = read('./content/landing.ts');
  const hero = read('./components/Hero.tsx');
  const footer = read('./components/ContactFooter.tsx');

  assert.match(content, /Berapa lama lagi mau bertahan seperti ini\?/);
  assert.match(content, /Ruang aman untuk refleksi & penyembuhan diri/);
  assert.match(content, /13-14 Juni 2026 \| Toraja D, Four Points/);
  assert.match(content, /Hanya 40 Kursi/);
  assert.match(content, /Amankan Kursi Saya/);
  assert.match(hero, /Hidupmu,/);
  assert.match(hero, /Kamu Navigatornya\./);
  assert.match(hero, /hero\.ctaLabel/);

  assert.equal((content.match(/title: '/g) ?? []).length >= 12, true);
  assert.equal((content.match(/Batch [12] Malaysia/g) ?? []).length >= 6, true);
  assert.match(content, /Investment: hubungi contact person via WhatsApp/);
  assert.match(footer, /investmentText/);

  assert.equal(app.includes('EventDetails'), false);
  assert.match(app, /<Hero \/>[\s\S]*<EmpathySection \/>[\s\S]*<WorkshopPillars \/>[\s\S]*<PhotoProof \/>[\s\S]*<TrainerProfiles \/>[\s\S]*<ContactFooter \/>/);
});
