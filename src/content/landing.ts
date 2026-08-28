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

export type WorkshopBatchId = '4' | '5';

export interface WorkshopBatch {
  id: WorkshopBatchId;
  label: string;
  badge: string;
  tagline: string;
  event: EventInfo;
  contacts: Contact[];
  organizerLogos: string[];
  sponsorLogos: string[];
  defaultLocale: WorkshopLocale;
  heroKicker: Record<WorkshopLocale, string>;
  registrationMessage: Record<WorkshopLocale, string>;
}

export const workshopBatches: Record<WorkshopBatchId, WorkshopBatch> = {
  '4': {
    id: '4',
    label: 'Batch 4 · Kota Kinabalu',
    badge: 'Batch 4 Sabah',
    tagline: 'Navigasi Hidup Cara Sendiri',
    event: {
      name: 'The Inner Compass Workshop Batch 4',
      city: 'Malaysia',
      venue: 'Kota Kinabalu',
      date: '24-25 Oktober 2026',
      time: '09.00 - 18.00 MYT',
      capacity: '50 Kursi',
      organizers: ['Start-Up Global'],
      partners: ['Pesan Cinta', 'Rantau Putra'],
    },
    contacts: [
      { name: 'Mimi', phone: '+6014 863 2020' },
      { name: 'Zai', phone: '+6013 309 7710' },
    ],
    organizerLogos: ['/startupglobal.png', '/pesancinta.png'],
    sponsorLogos: ['/logo-medina.svg'],
    defaultLocale: 'ms',
    heroKicker: {
      ms: '2 Hari Bengkel · 24-25 Okt 2026 · Kota Kinabalu',
      id: '2 Hari Workshop · 24-25 Okt 2026 · Kota Kinabalu',
      en: '2-Day Workshop · 24-25 Oct 2026 · Kota Kinabalu',
    },
    registrationMessage: {
      ms: 'Salam, saya berminat untuk mendaftar The Inner Compass Workshop Batch 4 di Kota Kinabalu (24-25 Okt 2026). Boleh kongsikan maklumat lanjut?',
      id: 'Halo, saya tertarik untuk mendaftar The Inner Compass Workshop Batch 4 di Kota Kinabalu (24-25 Okt 2026). Boleh minta info pendaftaran?',
      en: 'Hello, I would like to register for The Inner Compass Workshop Batch 4 in Kota Kinabalu (24-25 Oct 2026). Could you share more details?',
    },
  },
  '5': {
    id: '5',
    label: 'Batch 5 · Makassar',
    badge: 'Batch 5 Makassar',
    tagline: 'Hidupmu, Kamu Navigatornya!',
    event: {
      name: 'The Inner Compass Workshop Batch 5',
      city: 'Makassar, Indonesia',
      venue: 'Four Point Hotel Makassar',
      date: '31 Oktober - 1 November 2026',
      time: '09.00 - 18.00 WITA',
      capacity: '50 Kursi',
      organizers: ['Pesan Cinta'],
      partners: ['Kemas Ki', 'Makanja Factory', 'Qofftea'],
    },
    contacts: [
      { name: 'Vanny', phone: '+62 813 5667 6933' },
      { name: 'Zai', phone: '+6013 309 7710' },
    ],
    organizerLogos: ['/pesancinta.png'],
    sponsorLogos: ['/logo-medina.svg'],
    defaultLocale: 'id',
    heroKicker: {
      ms: '2 Hari Bengkel · 31 Okt - 1 Nov 2026 · Makassar',
      id: '2 Hari Workshop · 31 Okt - 1 Nov 2026 · Makassar',
      en: '2-Day Workshop · 31 Oct - 1 Nov 2026 · Makassar',
    },
    registrationMessage: {
      ms: 'Salam, saya berminat untuk mendaftar The Inner Compass Workshop Batch 5 di Makassar (31 Okt - 1 Nov 2026). Boleh kongsikan maklumat lanjut?',
      id: 'Halo, saya tertarik untuk mendaftar The Inner Compass Workshop Batch 5 di Makassar (31 Okt - 1 Nov 2026). Boleh minta info pendaftaran?',
      en: 'Hello, I would like to register for The Inner Compass Workshop Batch 5 in Makassar (31 Okt - 1 Nov 2026). Could you share more details?',
    },
  },
};
