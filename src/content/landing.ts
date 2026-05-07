import { createWhatsAppUrl } from '../lib/whatsapp';

export const registrationMessage =
  'Halo, saya ingin mendaftar The Inner Compass Workshop Batch 3 Makassar. Mohon info langkah pendaftarannya.';

export const contacts = [
  { name: 'Zai', phone: '+60 13 309 7710' },
  { name: 'Vanny', phone: '+62 813 5667 6933' },
  { name: 'Jack', phone: '+62 853 4200 7345' },
  { name: 'Jumran', phone: '+62 852 4179 4978' },
] as const;

export const mainContact = contacts[0];

export const registrationUrl = createWhatsAppUrl(mainContact.phone, registrationMessage);

export const hero = {
  eyebrow: 'The Inner Compass Workshop Batch 3 - Makassar',
  headline: 'Berapa lama lagi mau bertahan seperti ini?',
  subheadline: 'Ruang aman untuk refleksi & penyembuhan diri',
  info: '13-14 Juni 2026 | Toraja D, Four Points',
  badge: 'Hanya 40 Kursi',
  ctaLabel: 'Amankan Kursi Saya',
};

export const event = {
  name: 'The Inner Compass Workshop Batch 3',
  city: 'Makassar, Indonesia',
  venue: 'Toraja D, Four Points',
  date: '13-14 Juni 2026',
  time: '09.00 - 21.00 WITA',
  capacity: '40 Kursi',
  organizers: ['Pesan Cinta'],
  partners: [],
};

export const whyParagraphs = [
  'Kamu tetap menjawab “aman”, meski tubuh sudah lelah duluan.',
  'Kalender penuh, kepala bising, tapi sulit memberi jeda untuk diri sendiri.',
  'Ada beban yang tidak hilang karena terus ditahan sendirian.',
  'Di sini, kamu belajar berhenti sebentar tanpa harus menjelaskan semuanya.',
] as const;

export const pillars = [
  {
    title: 'Trainer Berpengalaman & Profesional',
    text: 'Dipandu trainer yang memahami proses refleksi, emosi, dan dinamika peserta.',
  },
  {
    title: 'Training Berasaskan Pengalaman',
    text: 'Belajar lewat praktik langsung, bukan hanya duduk mendengar materi.',
  },
  {
    title: 'Training yang Interaktif',
    text: 'Sesi berisi latihan, diskusi, dan proses bersama yang membuat peserta terlibat.',
  },
  {
    title: 'Tension & Trauma Releasing Exercise',
    text: 'Latihan terpandu untuk mengenali ketegangan tubuh dan melepasnya perlahan.',
  },
] as const;

export const trainers = [
  {
    name: 'Tunku Nina Mansur',
    quote: 'Kita mulai dari yang terasa di tubuh, bukan dari jawaban yang rapi.',
    initials: 'TN',
  },
  {
    name: 'Jonelle Huang',
    quote: 'Tidak semua hal perlu dipaksa selesai. Kadang cukup didengar dulu.',
    initials: 'JH',
  },
] as const;

export const proofPhotos = [
  { src: '/WhatsApp Image 2026-05-06 at 22.12.42.jpeg' },
  { src: '/WhatsApp Image 2026-05-06 at 22.12.39.jpeg' },
  { src: '/WhatsApp Image 2026-05-06 at 22.12.40.jpeg' },
  { src: '/WhatsApp Image 2026-05-06 at 22.12.41.jpeg' },
  { src: '/WhatsApp Image 2026-05-06 at 22.12.44.jpeg' },
] as const;

export const investmentText = 'Investment diinformasikan via WhatsApp';
