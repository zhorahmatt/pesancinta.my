import data from './innerCompass.json';

// The editable content for the Inner Compass workshop page lives in
// innerCompass.json so the local admin editor (/admin/inner-compass) can read
// and rewrite it. This module is a thin, typed adapter that re-exports the same
// public surface the page components already consume.

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

const content = data as unknown as InnerCompassData;

export const event: EventInfo = content.event;
export const contacts: Contact[] = content.contacts;
export const mainContact: Contact = contacts[0];

export const defaultWorkshopLocale: WorkshopLocale = content.defaultLocale;
export const workshopLocaleOrder: WorkshopLocale[] = content.localeOrder;
export const workshopLocales: Record<WorkshopLocale, WorkshopContent> = content.locales;

export const sectionLayout: SectionLayoutItem[] = content.layout;

export const proofPhotoGroups: string[][] = content.photoGroups.proof;
export const batchThreePhotoGroups: string[][] = content.photoGroups.batchThree;
