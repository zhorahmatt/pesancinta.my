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

test('project documents Supabase CMS environment setup', () => {
  const envExample = read('../.env.example');
  const readme = read('../README.md');

  assert.match(envExample, /VITE_SUPABASE_URL=/);
  assert.match(envExample, /VITE_SUPABASE_ANON_KEY=/);
  assert.match(readme, /Supabase CMS Setup/);
  assert.match(readme, /Do not commit real `\.env` values/);
});

test('Supabase CMS schema migration covers workshops and payments', () => {
  const migration = read('../supabase/migrations/20260508000000_create_workshop_cms.sql');

  for (const table of ['workshops', 'workshop_locales', 'workshop_prices', 'payment_methods', 'registrations', 'payment_proofs']) {
    assert.match(migration, new RegExp(`create table public\\.${table}`));
  }

  for (const status of ['draft', 'published', 'archived', 'pending', 'awaiting_payment', 'payment_submitted', 'confirmed', 'cancelled', 'refunded']) {
    assert.match(migration, new RegExp(`'${status}'`));
  }

  assert.match(migration, /workshop_currency.*'MYR'.*'IDR'/s);
  assert.match(migration, /workshop_country.*'MY'.*'ID'/s);
  assert.match(migration, /payment_method_type.*'bank_transfer'.*'static_qr'/s);
  assert.match(migration, /slug text not null unique/);
  assert.match(migration, /references public\.workshops\(id\)/);
});

test('Supabase CMS RLS migration protects admin data and public registration', () => {
  const migration = read('../supabase/migrations/20260508001000_add_workshop_cms_rls.sql');

  for (const table of ['admin_users', 'workshops', 'workshop_locales', 'workshop_prices', 'payment_methods', 'registrations', 'payment_proofs']) {
    assert.match(migration, new RegExp(`alter table public\\.${table} enable row level security`));
  }

  assert.match(migration, /create or replace function public\.is_cms_admin\(\)/);
  assert.match(migration, /auth\.uid\(\)/);
  assert.match(migration, /for select\s+using \(status = 'published'\)/s);
  assert.match(migration, /for insert\s+with check \(true\)/s);
  assert.match(migration, /for all\s+using \(public\.is_cms_admin\(\)\)/s);
  assert.match(migration, /for select\s+using \(public\.is_cms_admin\(\)\)/s);
});

test('Supabase CMS client and domain helpers are typed', () => {
  const packageJson = read('../package.json');
  const supabaseClient = read('./lib/supabase.ts');
  const workshopTypes = read('./types/workshop.ts');
  const registrationTypes = read('./types/registration.ts');
  const workshops = read('./lib/workshops.ts');
  const registrations = read('./lib/registrations.ts');

  assert.match(packageJson, /"@supabase\/supabase-js"/);
  assert.match(supabaseClient, /createClient<Database>/);
  assert.match(supabaseClient, /import\.meta\.env\.VITE_SUPABASE_URL/);
  assert.match(supabaseClient, /import\.meta\.env\.VITE_SUPABASE_ANON_KEY/);
  assert.match(workshopTypes, /export type WorkshopStatus = 'draft' \| 'published' \| 'archived'/);
  assert.match(workshopTypes, /export type WorkshopCurrency = 'MYR' \| 'IDR'/);
  assert.match(workshopTypes, /export type PaymentMethodType = 'bank_transfer' \| 'static_qr'/);
  assert.match(registrationTypes, /export type RegistrationStatus =/);
  assert.match(workshops, /export async function listPublishedWorkshops/);
  assert.match(workshops, /export async function getWorkshopBySlug/);
  assert.match(registrations, /export async function createRegistration/);
});

test('admin route has protected dashboard shell and auth helpers', () => {
  const app = read('./App.tsx');
  const auth = read('./lib/auth.ts');
  const login = read('./pages/admin/AdminLoginPage.tsx');
  const dashboard = read('./pages/admin/AdminDashboardPage.tsx');
  const layout = read('./components/admin/AdminLayout.tsx');

  assert.match(app, /\/admin/);
  assert.match(app, /<AdminDashboardPage/);
  assert.match(auth, /getSession/);
  assert.match(auth, /signInWithPassword/);
  assert.match(auth, /signOut/);
  assert.match(login, /Admin Login/);
  assert.match(login, /type="email"/);
  assert.match(login, /type="password"/);
  assert.match(dashboard, /ProtectedAdminRoute/);
  assert.match(dashboard, /AdminLayout/);
  assert.match(layout, /Workshops/);
  assert.match(layout, /Registrations/);
  assert.match(layout, /Payments/);
});

test('admin workshop basics flow has list, editor, and validation helpers', () => {
  const app = read('./App.tsx');
  const workshops = read('./lib/workshops.ts');
  const listPage = read('./pages/admin/WorkshopsPage.tsx');
  const editorPage = read('./pages/admin/WorkshopEditorPage.tsx');
  const basicsForm = read('./components/admin/WorkshopBasicsForm.tsx');

  assert.match(app, /\/admin\/workshops\/new/);
  assert.match(app, /<WorkshopEditorPage/);
  assert.match(app, /<WorkshopsPage \/>/);
  assert.match(workshops, /export function isValidWorkshopSlug/);
  assert.match(workshops, /export function isValidWorkshopCapacity/);
  assert.match(workshops, /export async function listAdminWorkshops/);
  assert.match(workshops, /export async function getAdminWorkshopById/);
  assert.match(workshops, /export async function createWorkshop/);
  assert.match(workshops, /export async function updateWorkshop/);
  assert.match(listPage, /listAdminWorkshops/);
  assert.match(listPage, /New workshop/);
  assert.match(editorPage, /WorkshopBasicsForm/);
  assert.match(editorPage, /createWorkshop/);
  assert.match(editorPage, /updateWorkshop/);
  assert.match(basicsForm, /Slug is required/);
  assert.match(basicsForm, /Capacity must be positive/);
  assert.match(basicsForm, /draft/);
  assert.match(basicsForm, /published/);
  assert.match(basicsForm, /archived/);
});

test('admin localized content editor supports BM, ID, and optional EN', () => {
  const workshops = read('./lib/workshops.ts');
  const editorPage = read('./pages/admin/WorkshopEditorPage.tsx');
  const contentForm = read('./components/admin/WorkshopContentForm.tsx');

  assert.match(workshops, /export type WorkshopContentInput/);
  assert.match(workshops, /export async function listWorkshopLocaleContent/);
  assert.match(workshops, /export async function upsertWorkshopLocaleContent/);
  assert.match(workshops, /export function hasRequiredDefaultLocaleContent/);
  assert.match(editorPage, /WorkshopContentForm/);
  assert.match(contentForm, /Bahasa Malaysia/);
  assert.match(contentForm, /Bahasa Indonesia/);
  assert.match(contentForm, /English optional/);
  assert.match(contentForm, /headline/);
  assert.match(contentForm, /subheadline/);
  assert.match(contentForm, /description/);
  assert.match(contentForm, /cta_label/);
  assert.match(contentForm, /registration_message/);
  assert.match(contentForm, /sections_json/);
  assert.match(contentForm, /Default-locale content is required before publishing/);
});

test('admin pricing and manual payment forms support MYR, IDR, bank transfer, and static QR', () => {
  const workshops = read('./lib/workshops.ts');
  const editorPage = read('./pages/admin/WorkshopEditorPage.tsx');
  const pricingForm = read('./components/admin/WorkshopPricingForm.tsx');
  const paymentForm = read('./components/admin/PaymentMethodsForm.tsx');

  assert.match(workshops, /export type WorkshopPriceInput/);
  assert.match(workshops, /export type PaymentMethodInput/);
  assert.match(workshops, /export async function listWorkshopPrices/);
  assert.match(workshops, /export async function upsertWorkshopPrice/);
  assert.match(workshops, /export async function listWorkshopPaymentMethods/);
  assert.match(workshops, /export async function upsertWorkshopPaymentMethod/);
  assert.match(editorPage, /WorkshopPricingForm/);
  assert.match(editorPage, /PaymentMethodsForm/);
  assert.match(pricingForm, /MYR/);
  assert.match(pricingForm, /IDR/);
  assert.match(paymentForm, /bank_transfer/);
  assert.match(paymentForm, /static_qr/);
  assert.match(paymentForm, /qr_image_url/);
  assert.match(paymentForm, /is_active/);
});

test('public CMS workshop page renders published workshop data by slug', () => {
  const app = read('./App.tsx');
  const publicPage = read('./pages/WorkshopPublicPage.tsx');
  const workshops = read('./lib/workshops.ts');

  assert.match(app, /<WorkshopPublicPage/);
  assert.match(app, /the-inner-compass-workshop/);
  assert.match(publicPage, /getWorkshopBySlug/);
  assert.match(publicPage, /workshop_locales/);
  assert.match(publicPage, /workshop_prices/);
  assert.match(publicPage, /payment_methods/);
  assert.match(publicPage, /show_remaining_seats/);
  assert.match(publicPage, /active payment methods/);
  assert.match(workshops, /eq\('status', 'published'\)/);
  assert.match(workshops, /is_active/);
});

test('public registration form validates visitor details and shows manual payment instructions', () => {
  const publicPage = read('./pages/WorkshopPublicPage.tsx');
  const registrationForm = read('./components/workshop/RegistrationForm.tsx');
  const instructions = read('./components/workshop/PaymentInstructions.tsx');
  const registrations = read('./lib/registrations.ts');

  assert.match(publicPage, /RegistrationForm/);
  assert.match(registrationForm, /full_name/);
  assert.match(registrationForm, /email/);
  assert.match(registrationForm, /phone/);
  assert.match(registrationForm, /country/);
  assert.match(registrationForm, /notes/);
  assert.match(registrationForm, /payment_method_id/);
  assert.match(registrationForm, /validateRegistrationForm/);
  assert.match(registrationForm, /PaymentInstructions/);
  assert.match(instructions, /instructions/);
  assert.match(registrations, /export function canAcceptRegistration/);
  assert.match(registrations, /awaiting_payment/);
});

test('optional payment proof handling stores access-controlled uploads', () => {
  const proofUpload = read('./components/workshop/PaymentProofUpload.tsx');
  const registrations = read('./lib/registrations.ts');
  const storage = read('./lib/storage.ts');

  assert.match(proofUpload, /PaymentProofUpload/);
  assert.match(proofUpload, /payment_submitted/);
  assert.match(proofUpload, /uploadPaymentProof/);
  assert.match(registrations, /export async function createPaymentProof/);
  assert.match(registrations, /export async function markRegistrationPaymentSubmitted/);
  assert.match(storage, /payment-proofs/);
  assert.match(storage, /uploadPaymentProof/);
  assert.match(storage, /getPaymentProofPath/);
});

test('admin registration review supports filtering, details, and status updates', () => {
  const app = read('./App.tsx');
  const registrationsPage = read('./pages/admin/RegistrationsPage.tsx');
  const detailPage = read('./pages/admin/RegistrationDetailPage.tsx');
  const statusSelect = read('./components/admin/RegistrationStatusSelect.tsx');
  const registrations = read('./lib/registrations.ts');

  assert.match(app, /RegistrationsPage/);
  assert.match(app, /RegistrationDetailPage/);
  assert.match(registrationsPage, /listRegistrationsByWorkshop/);
  assert.match(registrationsPage, /filterStatus/);
  assert.match(detailPage, /getRegistrationById/);
  assert.match(detailPage, /RegistrationStatusSelect/);
  assert.match(statusSelect, /confirmed/);
  assert.match(statusSelect, /cancelled/);
  assert.match(statusSelect, /refunded/);
  assert.match(statusSelect, /pending/);
  assert.match(registrations, /export async function getRegistrationById/);
  assert.match(registrations, /export async function updateRegistrationStatus/);
});

test('MVP notifications keep provider secrets out of frontend and support WhatsApp links', () => {
  const notifications = read('./lib/notifications.ts');
  const statusSelect = read('./components/admin/RegistrationStatusSelect.tsx');
  const registrationForm = read('./components/workshop/RegistrationForm.tsx');
  const spec = read('../SPEC.md');

  assert.match(notifications, /createWhatsAppNotificationUrl/);
  assert.match(notifications, /wa\.me/);
  assert.match(notifications, /notifyRegistrationSubmitted/);
  assert.match(notifications, /notifyPaymentConfirmed/);
  assert.match(statusSelect, /notifyPaymentConfirmed/);
  assert.match(registrationForm, /notifyRegistrationSubmitted/);
  assert.match(spec, /Store provider secrets in frontend code/);
});

test('Inner Compass seed data maps current workshop into CMS shape', () => {
  const seed = read('../supabase/seed.sql');
  const app = read('./App.tsx');

  assert.match(seed, /the-inner-compass-workshop/);
  assert.match(seed, /The Inner Compass Workshop/);
  assert.match(seed, /'ms'/);
  assert.match(seed, /'id'/);
  assert.match(seed, /MYR/);
  assert.match(seed, /IDR/);
  assert.match(seed, /bank_transfer/);
  assert.match(seed, /static_qr/);
  assert.match(app, /<InnerCompassWorkshopPage \/>/);
});

test('CMS MVP release checklist covers auth, RLS, registration, capacity, and existing pages', () => {
  const plan = read('../tasks/plan.md');
  const todo = read('../tasks/todo.md');
  const app = read('./App.tsx');
  const registrations = read('./lib/registrations.ts');
  const rls = read('../supabase/migrations/20260508001000_add_workshop_cms_rls.sql');

  assert.match(plan, /End-to-end QA and release checklist/);
  assert.match(plan, /Admin auth blocks public access/);
  assert.match(plan, /Anonymous user cannot edit CMS data/);
  assert.match(plan, /Registration works for Malaysia and Indonesia payment methods/);
  assert.match(plan, /Capacity limit cannot be bypassed through UI/);
  assert.match(todo, /End-to-end QA and release checklist/);
  assert.match(app, /AdminDashboardPage/);
  assert.match(app, /PesanCintaHomePage/);
  assert.match(app, /InnerCompassWorkshopPage/);
  assert.match(registrations, /canAcceptRegistration/);
  assert.match(rls, /public\.is_cms_admin\(\)/);
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
  const homeHtml = read('../index.html');
  const workshopHtml = read('../the-inner-compass-workshop/index.html');
  const viteConfig = read('../vite.config.ts');
  const vercelConfig = read('../vercel.json');

  assert.match(homeHtml, /<title>Pesan Cinta<\/title>/);
  assert.match(homeHtml, /og:title" content="Pesan Cinta"/);
  assert.match(workshopHtml, /<title>The Inner Compass Workshop Batch 3 Makassar<\/title>/);
  assert.match(workshopHtml, /og:title" content="The Inner Compass Workshop Batch 3 Makassar"/);
  assert.match(workshopHtml, /og:image" content="https:\/\/pesancinta\.my\/g17\.jpeg"/);
  assert.match(workshopHtml, /twitter:image" content="https:\/\/pesancinta\.my\/g17\.jpeg"/);
  assert.match(viteConfig, /the-inner-compass-workshop\/index\.html/);
  assert.match(vercelConfig, /"source": "\/the-inner-compass-workshop"/);
  assert.match(vercelConfig, /"destination": "\/the-inner-compass-workshop\/index\.html"/);

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
