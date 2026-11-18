// Type definitions for the Inner Compass workshop page content. The runtime
// data is fetched from Supabase (see ./innerCompassData) — this module only
// re-exports the shape so the public page components can stay strongly typed.

export interface Contact {
  name: string;
  phone: string;
}

export interface EventInfo {
  name: string;
  city: string;
  venue: string;
  date: string;
  time: string;
  capacity: string;
  organizers: string[];
  partners: string[];
}

export interface HeroContent {
  eyebrow: string;
  kicker: string;
  headlineLines: string[];
  subheadline: string;
  badge: string;
  ctaLabel: string;
  eventLabels: {
    date: string;
    venue: string;
    city: string;
  };
}

export interface EmpathyContent {
  eyebrow: string;
  headline: string;
  subheadline: string;
  paragraphs: string[];
}

export interface PillarItem {
  title: string;
  text: string;
}

export interface PillarsContent {
  eyebrow: string;
  headlinePrefix: string;
  headlineAccent: string;
  headlineSuffix: string;
  subheadline: string;
  items: PillarItem[];
}

export interface PhotoProofContent {
  eyebrow: string;
  headline: string;
  subheadline: string;
}

export interface TestimonialItem {
  text: string;
  image: string;
  name: string;
  role: string;
}

export interface TestimonialsContent {
  eyebrow: string;
  headline: string;
  subheadline: string;
  items: TestimonialItem[];
}

export interface TrainerItem {
  name: string;
  quote: string;
  initials: string;
}

export interface TrainersContent {
  eyebrow: string;
  headline: string;
  subheadline: string;
  roleLabel: string;
  instagramLabel: string;
  items: TrainerItem[];
}

export interface FasilitasItem {
  title: string;
  text: string;
}

export interface FasilitasContent {
  eyebrow: string;
  headline: string;
  subheadline: string;
  items: FasilitasItem[];
}

export interface FooterContent {
  eyebrow: string;
  headline: string;
  investmentText: string;
  contactPrompt: string;
  dateLabel: string;
  capacityLabel: string;
  cityLabel: string;
  whatsappLabel: string;
  organizerLabel: string;
  sponsorLabel: string;
  organizerLogoAlt: string;
  sponsorLogoAlt: string;
  copyright: string;
}

export interface WorkshopContent {
  label: string;
  name: string;
  registrationMessage: string;
  hero: HeroContent;
  empathy: EmpathyContent;
  pillars: PillarsContent;
  photoProof: PhotoProofContent;
  testimonials: TestimonialsContent;
  trainers: TrainersContent;
  fasilitas: FasilitasContent;
  footer: FooterContent;
}

export type WorkshopLocale = 'ms' | 'id' | 'en';

export type SectionKey = 'empathy' | 'pillars' | 'photoProof' | 'testimonials' | 'trainers' | 'fasilitas';

export interface SectionLayoutItem {
  key: SectionKey;
  visible: boolean;
}

export interface InnerCompassData {
  event: EventInfo;
  contacts: Contact[];
  photoGroups: {
    proof: string[][];
    batchThree: string[][];
  };
  layout: SectionLayoutItem[];
  defaultLocale: WorkshopLocale;
  localeOrder: WorkshopLocale[];
  locales: Record<WorkshopLocale, WorkshopContent>;
}

export type WorkshopBatchId = '5' | '6';

export interface WorkshopBatch {
  id: WorkshopBatchId;
  label: string;
  badge: string;
  tagline: string;
  /** Stored with each registration; keep unique per event so batches never mix. */
  eventKey: string;
  /** Short city shown in the footer strip next to the date. */
  cityLabel: string;
  event: EventInfo;
  contacts: Contact[];
  organizerLogos: string[];
  sponsorLogos: string[];
  defaultLocale: WorkshopLocale;
  heroKicker: Record<WorkshopLocale, string>;
  registrationMessage: Record<WorkshopLocale, string>;
}

export const defaultWorkshopBatchId: WorkshopBatchId = '5';

export const workshopBatches: Record<WorkshopBatchId, WorkshopBatch> = {
  '5': {
    id: '5',
    label: 'Batch 5 · Bali',
    badge: 'Batch 5 Bali',
    tagline: 'Hidupmu, Kamu Navigatornya!',
    eventKey: 'inner-compass-batch-5-bali',
    cityLabel: 'Denpasar, Bali',
    event: {
      name: 'The Inner Compass Escape Bali Batch 5',
      city: 'Indonesia',
      venue: 'Denpasar, Bali',
      date: '22-24 Januari 2027',
      time: '09.00 - 18.00 WITA',
      capacity: '50 Kursi',
      organizers: ['Pesan Cinta'],
      partners: ['Jalan Bareng Yuk!', 'Sultanah'],
    },
    contacts: [
      { name: 'Febry', phone: '+62 818 0822 2993' },
      { name: 'Zai', phone: '+6013 309 7710' },
    ],
    organizerLogos: ['/pesancinta.png'],
    sponsorLogos: ['/logo-medina.svg'],
    defaultLocale: 'id',
    heroKicker: {
      ms: '3 Hari Bengkel · 22-24 Jan 2027 · Denpasar, Bali',
      id: '3 Hari Workshop · 22-24 Jan 2027 · Denpasar, Bali',
      en: '3-Day Workshop · 22-24 Jan 2027 · Denpasar, Bali',
    },
    registrationMessage: {
      ms: 'Salam, saya berminat untuk mendaftar The Inner Compass Escape Bali Batch 5 di Denpasar, Bali (22-24 Jan 2027). Boleh kongsikan maklumat lanjut?',
      id: 'Halo, saya tertarik untuk mendaftar The Inner Compass Escape Bali Batch 5 di Denpasar, Bali (22-24 Jan 2027). Boleh minta info pendaftaran?',
      en: 'Hello, I would like to register for The Inner Compass Escape Bali Batch 5 in Denpasar, Bali (22-24 Jan 2027). Could you share more details?',
    },
  },
  '6': {
    id: '6',
    label: 'Batch 6 · Makassar',
    badge: 'Batch 6 Makassar',
    tagline: 'Hidupmu, Kamu Navigatornya!',
    eventKey: 'inner-compass-batch-6-makassar',
    cityLabel: 'Makassar',
    event: {
      name: 'The Inner Compass Workshop Batch 6',
      city: 'Indonesia',
      venue: 'Kota Makassar',
      date: '17-18 April 2027',
      time: '09.00 - 18.00 WITA',
      capacity: '50 Kursi',
      organizers: ['Pesan Cinta'],
      partners: ['Jeckstore', 'Kemas Ki', 'Makanja Factory', 'Qofftea'],
    },
    contacts: [
      { name: 'Vanny', phone: '+62 813 5667 6933' },
      { name: 'Zai', phone: '+6013 309 7710' },
    ],
    organizerLogos: ['/pesancinta.png'],
    sponsorLogos: ['/logo-medina.svg'],
    defaultLocale: 'id',
    heroKicker: {
      ms: '2 Hari Bengkel · 17-18 Apr 2027 · Makassar',
      id: '2 Hari Workshop · 17-18 Apr 2027 · Makassar',
      en: '2-Day Workshop · 17-18 Apr 2027 · Makassar',
    },
    registrationMessage: {
      ms: 'Salam, saya berminat untuk mendaftar The Inner Compass Workshop Batch 6 di Makassar (17-18 Apr 2027). Boleh kongsikan maklumat lanjut?',
      id: 'Halo, saya tertarik untuk mendaftar The Inner Compass Workshop Batch 6 di Makassar (17-18 Apr 2027). Boleh minta info pendaftaran?',
      en: 'Hello, I would like to register for The Inner Compass Workshop Batch 6 in Makassar (17-18 Apr 2027). Could you share more details?',
    },
  },
};
