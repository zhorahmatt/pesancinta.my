export const contacts = [
  { name: 'Zai', phone: '+60 13 309 7710' },
  { name: 'Vanny', phone: '+62 813 5667 6933' },
  { name: 'Jack', phone: '+62 853 4200 7345' },
  { name: 'Jumran', phone: '+62 852 4179 4978' },
] as const;

export const mainContact = contacts[0];

export const event = {
  name: 'The Inner Compass Workshop Batch 4',
  city: 'Pekanbaru, Indonesia',
  venue: 'To be confirmed',
  date: '29-30 Agustus 2026',
  time: '09.00 - 21.00 WIB',
  capacity: '40 Kursi',
  organizers: ['Pesan Cinta'],
  partners: [],
} as const;

export const defaultWorkshopLocale = 'ms';
export const workshopLocaleOrder = ['ms', 'id', 'en'] as const;

export const workshopLocales = {
  ms: {
    label: 'BM',
    name: 'Bahasa Malaysia',
    registrationMessage:
      'Halo, saya ingin mendaftar The Inner Compass Workshop Batch 4 Pekanbaru. Mohon info langkah pendaftarannya.',
    hero: {
      eyebrow: 'The Inner Compass Workshop Batch 4 - Pekanbaru',
      kicker: 'Mulai Hari Ini',
      headlineLines: ['Hidupmu,', 'Kamu Navigatornya.'],
      subheadline: 'Saat hidup terasa dikawal tuntutan, tubuh sering tahu arah pulang sebelum fikiran berani mengakuinya.',
      badge: 'Hanya 40 Kerusi',
      ctaLabel: 'Amankan Kerusi Saya',
      eventLabels: {
        date: 'Tarikh',
        venue: 'Tempat',
        city: 'Kota',
      },
    },
    empathy: {
      eyebrow: 'Why This Workshop',
      headline: 'Untuk kamu yang terlalu lama kuat sendirian.',
      subheadline: 'Dari luar terlihat mampu. Di dalam, tubuh mungkin sudah lama meminta jeda.',
      paragraphs: [
        'Kamu tetap menjawab “baik”, walaupun tubuh sudah lelah terlebih dahulu.',
        'Kalender penuh, kepala bising, tetapi sukar memberi ruang untuk diri sendiri.',
        'Ada beban yang tidak hilang kerana terus ditahan sendirian.',
        'Di sini, kamu belajar berhenti sebentar tanpa perlu menjelaskan semuanya.',
      ],
    },
    pillars: {
      eyebrow: 'Workshop Benefits',
      headlinePrefix: 'Saatnya menentukan',
      headlineAccent: 'kompas',
      headlineSuffix: 'hidupmu',
      subheadline: 'Berani melangkah, nikmati prosesnya menuju versi terbaik diri',
      items: [
        {
          title: 'Trainer Berpengalaman & Profesional',
          text: 'Dipandu trainer yang memahami proses refleksi, emosi, dan dinamika peserta.',
        },
        {
          title: 'Training Berasaskan Pengalaman',
          text: 'Belajar melalui praktik langsung, bukan sekadar duduk mendengar materi.',
        },
        {
          title: 'Training yang Interaktif',
          text: 'Sesi berisi latihan, diskusi, dan proses bersama yang membuat peserta terlibat.',
        },
        {
          title: 'Tension & Trauma Releasing Exercise',
          text: 'Latihan terpandu untuk mengenali ketegangan tubuh dan melepaskannya perlahan-lahan.',
        },
      ],
    },
    photoProof: {
      eyebrow: 'Inside The Room',
      headline: 'Rasakan prosesnya.',
      subheadline: 'Kamu akan bergerak, refleksi, berdiskusi, lalu pulang dengan rasa lebih ringan.',
    },
    trainers: {
      eyebrow: "Who's Teaching",
      headline: 'Kenali trainer workshop ini.',
      subheadline: 'Dua trainer menjaga proses tetap tenang, jelas, dan aman untuk jujur.',
      roleLabel: 'Trainer',
      instagramLabel: 'Instagram',
      items: [
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
      ],
    },
    footer: {
      eyebrow: 'Investment & Contact',
      headline: 'Tertarik ikut workshop ini?',
      investmentText: 'Investment diinformasikan via WhatsApp',
      contactPrompt: 'Pilih contact person yang paling mudah dihubungi.',
      dateLabel: '29-30 Agustus',
      capacityLabel: '40 Kerusi',
      cityLabel: 'Pekanbaru',
      whatsappLabel: 'WhatsApp',
      organizerLabel: 'Organizer',
      sponsorLabel: 'Partners & Sponsors',
      organizerLogoAlt: 'Organizer logo',
      sponsorLogoAlt: 'Sponsor',
      copyright: '© 2026 The Inner Compass Workshop. All Rights Reserved.',
    },
  },
  id: {
    label: 'ID',
    name: 'Bahasa Indonesia',
    registrationMessage:
      'Halo, saya ingin mendaftar The Inner Compass Workshop Batch 4 Pekanbaru. Mohon info langkah pendaftarannya.',
    hero: {
      eyebrow: 'The Inner Compass Workshop Batch 4 - Pekanbaru',
      kicker: 'Mulai Hari Ini',
      headlineLines: ['Hidupmu,', 'Kamu Navigatornya.'],
      subheadline: 'Saat hidup terasa dikendalikan tuntutan, tubuh sering tahu arah pulang sebelum pikiran berani mengakuinya.',
      badge: 'Hanya 40 Kursi',
      ctaLabel: 'Amankan Kursi Saya',
      eventLabels: {
        date: 'Tanggal',
        venue: 'Tempat',
        city: 'Kota',
      },
    },
    empathy: {
      eyebrow: 'Why This Workshop',
      headline: 'Untuk kamu yang terlalu lama kuat sendirian.',
      subheadline: 'Dari luar terlihat sanggup. Di dalam, tubuh mungkin sudah lama meminta jeda.',
      paragraphs: [
        'Kamu tetap menjawab “aman”, meski tubuh sudah lelah duluan.',
        'Kalender penuh, kepala bising, tapi sulit memberi jeda untuk diri sendiri.',
        'Ada beban yang tidak hilang karena terus ditahan sendirian.',
        'Di sini, kamu belajar berhenti sebentar tanpa harus menjelaskan semuanya.',
      ],
    },
    pillars: {
      eyebrow: 'Workshop Benefits',
      headlinePrefix: 'Saatnya menentukan',
      headlineAccent: 'kompas',
      headlineSuffix: 'hidupmu',
      subheadline: 'Berani melangkah, nikmati prosesnya menuju versi terbaik diri',
      items: [
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
      ],
    },
    photoProof: {
      eyebrow: 'Inside The Room',
      headline: 'Rasakan prosesnya.',
      subheadline: 'Kamu akan bergerak, refleksi, berdiskusi, lalu pulang dengan rasa lebih ringan.',
    },
    trainers: {
      eyebrow: "Who's Teaching",
      headline: 'Kenali trainer workshop ini.',
      subheadline: 'Dua trainer menjaga proses tetap tenang, jelas, dan aman untuk jujur.',
      roleLabel: 'Trainer',
      instagramLabel: 'Instagram',
      items: [
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
      ],
    },
    footer: {
      eyebrow: 'Investment & Contact',
      headline: 'Tertarik ikut workshop ini?',
      investmentText: 'Investment diinformasikan via WhatsApp',
      contactPrompt: 'Pilih contact person yang paling mudah dihubungi.',
      dateLabel: '29-30 Agustus',
      capacityLabel: '40 Kursi',
      cityLabel: 'Pekanbaru',
      whatsappLabel: 'WhatsApp',
      organizerLabel: 'Organizer',
      sponsorLabel: 'Partners & Sponsors',
      organizerLogoAlt: 'Organizer logo',
      sponsorLogoAlt: 'Sponsor',
      copyright: '© 2026 The Inner Compass Workshop. All Rights Reserved.',
    },
  },
  en: {
    label: 'EN',
    name: 'English',
    registrationMessage:
      'Hello, I would like to register for The Inner Compass Workshop Batch 4 Pekanbaru. Please send me the registration steps.',
    hero: {
      eyebrow: 'The Inner Compass Workshop Batch 4 - Pekanbaru',
      kicker: 'Start Today',
      headlineLines: ['Your life,', 'you navigate it.'],
      subheadline: 'When life feels driven by demands, your body often knows the way home before your mind can admit it.',
      badge: 'Only 40 Seats',
      ctaLabel: 'Secure My Seat',
      eventLabels: {
        date: 'Date',
        venue: 'Venue',
        city: 'City',
      },
    },
    empathy: {
      eyebrow: 'Why This Workshop',
      headline: 'For you who have been strong alone for too long.',
      subheadline: 'On the outside, you look capable. Inside, your body may have been asking for pause.',
      paragraphs: [
        'You keep saying “I’m fine”, even when your body is already tired.',
        'Your calendar is full and your head is loud, but rest still feels hard to choose.',
        'Some weight does not disappear when it keeps being held alone.',
        'Here, you learn to pause without needing to explain everything.',
      ],
    },
    pillars: {
      eyebrow: 'Workshop Benefits',
      headlinePrefix: 'It is time to choose',
      headlineAccent: 'your compass',
      headlineSuffix: 'in life',
      subheadline: 'Take the brave step, trust the process, and move toward your best self',
      items: [
        {
          title: 'Experienced & Professional Trainers',
          text: 'Guided by trainers who understand reflection, emotion, and group dynamics.',
        },
        {
          title: 'Experience-Based Training',
          text: 'Learn through direct practice, not only by sitting and listening to material.',
        },
        {
          title: 'Interactive Training',
          text: 'Sessions include exercises, discussion, and shared process that keep participants engaged.',
        },
        {
          title: 'Tension & Trauma Releasing Exercise',
          text: 'Guided practice to notice body tension and release it gently, step by step.',
        },
      ],
    },
    photoProof: {
      eyebrow: 'Inside The Room',
      headline: 'Feel the process.',
      subheadline: 'You will move, reflect, discuss, and leave with a lighter sense of self.',
    },
    trainers: {
      eyebrow: "Who's Teaching",
      headline: 'Meet your workshop trainers.',
      subheadline: 'Two trainers hold the process with calm, clarity, and safety for honesty.',
      roleLabel: 'Trainer',
      instagramLabel: 'Instagram',
      items: [
        {
          name: 'Tunku Nina Mansur',
          quote: 'We begin with what is felt in the body, not with a polished answer.',
          initials: 'TN',
        },
        {
          name: 'Jonelle Huang',
          quote: 'Not everything needs to be forced into completion. Sometimes it only needs to be heard first.',
          initials: 'JH',
        },
      ],
    },
    footer: {
      eyebrow: 'Investment & Contact',
      headline: 'Interested in joining this workshop?',
      investmentText: 'Investment details are shared via WhatsApp',
      contactPrompt: 'Choose the contact person easiest for you to reach.',
      dateLabel: '29-30 August',
      capacityLabel: '40 Seats',
      cityLabel: 'Pekanbaru',
      whatsappLabel: 'WhatsApp',
      organizerLabel: 'Organizer',
      sponsorLabel: 'Partners & Sponsors',
      organizerLogoAlt: 'Organizer logo',
      sponsorLogoAlt: 'Sponsor',
      copyright: '© 2026 The Inner Compass Workshop. All Rights Reserved.',
    },
  },
} as const;

export type WorkshopLocale = (typeof workshopLocaleOrder)[number];
export type WorkshopContent = (typeof workshopLocales)[WorkshopLocale];

export const proofPhotoGroups = [
  ['/g1.jpeg', '/g6.jpeg', '/g11.jpeg', '/g16.jpeg'],
  ['/g2.jpeg', '/g7.jpeg', '/g12.jpeg'],
  ['/g3.jpeg', '/g8.jpeg', '/g13.jpeg'],
  ['/g4.jpeg', '/g9.jpeg', '/g14.jpeg'],
  ['/g5.jpeg', '/g10.jpeg', '/g15.jpeg'],
] as const;
