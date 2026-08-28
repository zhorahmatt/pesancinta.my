export type HomeLocale = 'id' | 'ms';

export type HomeCta = {
  label: string;
  href: string;
  trackingTarget: string;
};

export type HomeContact = {
  name: string;
  phone: string;
};

export type HomeEvent = {
  label: string;
  title: string;
  tagline?: string;
  summary: string;
  media: string;
  gallery?: readonly string[];
  date?: string;
  duration?: string;
  venue?: string;
  city?: string;
  organizer?: string;
  poweredBy?: string;
  trainers?: string;
  contacts?: readonly HomeContact[];
  cta?: HomeCta;
};

export type HomePageContent = {
  languageName: string;
  navigation: {
    about: string;
    missions: string;
    activities: string;
  };
  hero: {
    label: string;
    headline: string;
    summary: string;
    cta: HomeCta;
  };
  about: {
    label: string;
    title: string;
    paragraphs: readonly string[];
  };
  missions: {
    label: string;
    title: string;
    featured: {
      title: string;
      description: string;
      media: string;
    };
    supporting: readonly {
      title: string;
      description: string;
    }[];
  };
  activities: {
    label: string;
    title: string;
    detailsLabels: {
      date: string;
      venue: string;
      city: string;
      duration: string;
      organizer: string;
      poweredBy: string;
      trainers: string;
      contact: string;
    };
    past: HomeEvent;
    upcoming: HomeEvent;
    upcomingEvents: HomeEvent[];
  };
  footer: {
    statement: string;
    partnerLabel: string;
    copyright: string;
  };
};

export const defaultHomeLocale: HomeLocale = 'id';
export const homeLocaleOrder: readonly HomeLocale[] = ['id', 'ms'];

export const homeLocales: Record<HomeLocale, HomePageContent> = {
  id: {
    languageName: 'Bahasa Indonesia',
    navigation: {
      about: 'Tentang',
      missions: 'Misi',
      activities: 'Kegiatan',
    },
    hero: {
      label: 'Pesan Cinta',
      headline: 'Kita semua butuh ruang untuk pulang ke diri sendiri.',
      summary: 'Pesan Cinta adalah ruang untuk berhenti sejenak, mendengar diri, dan merawat hubungan yang paling berarti.',
      cta: {
        label: 'Lihat kegiatan kami',
        href: '#kegiatan',
        trackingTarget: 'home-activities',
      },
    },
    about: {
      label: 'Tentang Pesan Cinta',
      title: 'Tempat untuk datang apa adanya.',
      paragraphs: [
        'Di Pesan Cinta, kamu tidak perlu punya semua jawaban. Kami mempertemukan orang-orang yang ingin memahami diri, merawat hubungan, dan menjalani hidup dengan lebih hadir.',
        'Melalui percakapan, gerak, dan refleksi, kita belajar mendengar apa yang sering tenggelam oleh kesibukan—lalu melangkah pelan, bersama.',
      ],
    },
    missions: {
      label: 'Misi kami',
      title: 'Hal-hal kecil yang kami jaga di setiap perjumpaan.',
      featured: {
        title: 'Mendengar lebih dalam',
        description: 'Kami memberi ruang pada cerita, emosi, dan kebutuhan yang kerap tak sempat didengar—tanpa menghakimi atau terburu-buru.',
        media: '/g6.jpeg',
      },
      supporting: [
        {
          title: 'Berani melangkah pelan',
          description: 'Kami percaya langkah kecil yang sesuai dengan diri sendiri tetap berarti. Kamu tidak harus menjalaninya seorang diri.',
        },
        {
          title: 'Merawat hubungan yang kita bawa pulang',
          description: 'Membawa lebih banyak kehadiran, empati, dan keberanian untuk berbicara jujur ke dalam relasi sehari-hari.',
        },
      ],
    },
    activities: {
      label: 'Kegiatan',
      title: 'Bertemu, bergerak, lalu pulang dengan cerita baru.',
      detailsLabels: {
        date: 'Tanggal',
        venue: 'Lokasi',
        city: 'Kota',
        duration: 'Keterangan',
        organizer: 'Penyelenggara',
        poweredBy: 'Didukung oleh',
        trainers: 'Trainer',
        contact: 'Kontak (WhatsApp)',
      },
      past: {
        label: 'Ruang yang telah kami buka',
        title: 'Jejak perjumpaan yang masih kami ingat',
        summary: 'Setiap pertemuan memberi kita waktu untuk bergerak, mendengar, dan melihat diri—bersama orang-orang yang juga sedang bertumbuh.',
        media: '/g1.jpeg',
        gallery: ['/g1.jpeg', '/g11.jpeg', '/g16.jpeg'],
      },
      upcoming: {
        label: 'Kegiatan berikutnya',
        title: 'The Inner Compass Workshop Batch 4',
        tagline: 'Navigasi Hidup Cara Sendiri',
        summary: 'Dua hari penuh refleksi dan kebersamaan untuk menemukan kembali arah hidupmu.',
        media: '/uploads/ticw-batch-4.jpeg',
        date: '24-25 Oktober 2026',
        duration: 'Workshop 2 Hari',
        venue: 'Kota Kinabalu',
        city: 'Malaysia',
        organizer: 'Start-Up Global',
        poweredBy: 'Pesan Cinta & Rantau Putra',
        trainers: 'Tunku Nina Mansur & Jonelle Huang',
        contacts: [
          { name: 'Mimi', phone: '+60148632020' },
          { name: 'Zai', phone: '+60133097710' },
        ],
        cta: {
          label: 'Lihat workshop',
          href: '/the-inner-compass-workshop',
          trackingTarget: 'inner-compass-workshop-batch-4',
        },
      },
      upcomingEvents: [
        {
          label: 'Kegiatan berikutnya',
          title: 'The Inner Compass Workshop Batch 4',
          tagline: 'Navigasi Hidup Cara Sendiri',
          summary: 'Dua hari penuh refleksi dan kebersamaan untuk menemukan kembali arah hidupmu.',
          media: '/uploads/ticw-batch-4.jpeg',
          date: '24-25 Oktober 2026',
          duration: 'Workshop 2 Hari',
          venue: 'Kota Kinabalu',
          city: 'Malaysia',
          organizer: 'Start-Up Global',
          poweredBy: 'Pesan Cinta & Rantau Putra',
          trainers: 'Tunku Nina Mansur & Jonelle Huang',
          contacts: [
            { name: 'Mimi', phone: '+60148632020' },
            { name: 'Zai', phone: '+60133097710' },
          ],
          cta: {
            label: 'Lihat workshop',
            href: '/the-inner-compass-workshop?batch=4',
            trackingTarget: 'inner-compass-workshop-batch-4',
          },
        },
        {
          label: 'Kegiatan berikutnya',
          title: 'The Inner Compass Workshop Batch 5',
          tagline: 'Hidupmu, Kamu Navigatornya!',
          summary: 'Dua hari untuk menepi dari kebisingan dan mengambil kendali penuh atas kompas hidupmu.',
          media: '/uploads/ticw-batch-5.jpeg',
          date: '31 Oktober - 1 November 2026',
          duration: 'Workshop 2 Hari',
          venue: 'Four Point Hotel Makassar',
          city: 'Indonesia',
          organizer: 'Pesan Cinta',
          poweredBy: 'Kemas Ki, Makanja Factory, dan Qofftea',
          trainers: 'Tunku Nina Mansur & Jonelle Huang',
          contacts: [
            { name: 'Vanny', phone: '+6281356676933' },
            { name: 'Zai', phone: '+60133097710' },
          ],
          cta: {
            label: 'Lihat workshop',
            href: '/the-inner-compass-workshop?batch=5',
            trackingTarget: 'inner-compass-workshop-batch-5',
          },
        },
      ],
    },
    footer: {
      statement: 'Semoga kita selalu punya ruang untuk pulih, berhubung, dan pulang pada cinta.',
      partnerLabel: 'Bersama Startup Global',
      copyright: '© 2026 Pesan Cinta',
    },
  },
  ms: {
    languageName: 'Bahasa Malaysia',
    navigation: {
      about: 'Tentang',
      missions: 'Misi',
      activities: 'Aktiviti',
    },
    hero: {
      label: 'Pesan Cinta',
      headline: 'Kita semua perlukan ruang untuk pulang kepada diri sendiri.',
      summary: 'Pesan Cinta ialah ruang untuk berhenti sejenak, mendengar diri, dan menjaga hubungan yang paling bermakna.',
      cta: {
        label: 'Lihat aktiviti kami',
        href: '#kegiatan',
        trackingTarget: 'home-activities',
      },
    },
    about: {
      label: 'Tentang Pesan Cinta',
      title: 'Tempat untuk datang seadanya.',
      paragraphs: [
        'Di Pesan Cinta, kamu tidak perlu mempunyai semua jawapan. Kami mempertemukan orang yang ingin memahami diri, menjaga hubungan, dan menjalani hidup dengan lebih hadir.',
        'Melalui perbualan, gerak, dan refleksi, kita belajar mendengar apa yang sering tenggelam dalam kesibukan—kemudian melangkah perlahan-lahan, bersama.',
      ],
    },
    missions: {
      label: 'Misi kami',
      title: 'Hal-hal kecil yang kami jaga dalam setiap pertemuan.',
      featured: {
        title: 'Mendengar lebih dalam',
        description: 'Kami memberi ruang untuk cerita, emosi, dan keperluan yang sering tidak sempat didengar—tanpa menghakimi atau terburu-buru.',
        media: '/g6.jpeg',
      },
      supporting: [
        {
          title: 'Berani melangkah perlahan',
          description: 'Kami percaya langkah kecil yang selari dengan diri sendiri tetap bermakna. Kamu tidak perlu melaluinya seorang diri.',
        },
        {
          title: 'Menjaga hubungan yang kita bawa pulang',
          description: 'Membawa lebih banyak kehadiran, empati, dan keberanian untuk berbual dengan jujur dalam hubungan setiap hari.',
        },
      ],
    },
    activities: {
      label: 'Aktiviti',
      title: 'Bertemu, bergerak, lalu pulang dengan cerita baharu.',
      detailsLabels: {
        date: 'Tarikh',
        venue: 'Lokasi',
        city: 'Kota',
        duration: 'Keterangan',
        organizer: 'Penganjur',
        poweredBy: 'Disokong oleh',
        trainers: 'Jurulatih',
        contact: 'Hubungi (WhatsApp)',
      },
      past: {
        label: 'Ruang yang telah kami buka',
        title: 'Jejak pertemuan yang masih kami ingat',
        summary: 'Setiap pertemuan memberi kita waktu untuk bergerak, mendengar, dan melihat diri—bersama orang yang juga sedang bertumbuh.',
        media: '/g1.jpeg',
        gallery: ['/g1.jpeg', '/g11.jpeg', '/g16.jpeg'],
      },
      upcoming: {
        label: 'Aktiviti seterusnya',
        title: 'The Inner Compass Workshop Batch 4',
        tagline: 'Navigasi Hidup Cara Sendiri',
        summary: 'Dua hari penuh refleksi dan kebersamaan untuk mencari semula arah kompas hidupmu.',
        media: '/uploads/ticw-batch-4.jpeg',
        date: '24-25 Oktober 2026',
        duration: 'Bengkel 2 Hari',
        venue: 'Kota Kinabalu',
        city: 'Malaysia',
        organizer: 'Start-Up Global',
        poweredBy: 'Pesan Cinta & Rantau Putra',
        trainers: 'Tunku Nina Mansur & Jonelle Huang',
        contacts: [
          { name: 'Mimi', phone: '+60148632020' },
          { name: 'Zai', phone: '+60133097710' },
        ],
        cta: {
          label: 'Lihat workshop',
          href: '/the-inner-compass-workshop',
          trackingTarget: 'inner-compass-workshop-batch-4',
        },
      },
      upcomingEvents: [
        {
          label: 'Aktiviti seterusnya',
          title: 'The Inner Compass Workshop Batch 4',
          tagline: 'Navigasi Hidup Cara Sendiri',
          summary: 'Dua hari penuh refleksi dan kebersamaan untuk mencari semula arah kompas hidupmu.',
          media: '/uploads/ticw-batch-4.jpeg',
          date: '24-25 Oktober 2026',
          duration: 'Bengkel 2 Hari',
          venue: 'Kota Kinabalu',
          city: 'Malaysia',
          organizer: 'Start-Up Global',
          poweredBy: 'Pesan Cinta & Rantau Putra',
          trainers: 'Tunku Nina Mansur & Jonelle Huang',
          contacts: [
            { name: 'Mimi', phone: '+60148632020' },
            { name: 'Zai', phone: '+60133097710' },
          ],
          cta: {
            label: 'Lihat workshop',
            href: '/the-inner-compass-workshop?batch=4',
            trackingTarget: 'inner-compass-workshop-batch-4',
          },
        },
        {
          label: 'Aktiviti seterusnya',
          title: 'The Inner Compass Workshop Batch 5',
          tagline: 'Hidupmu, Kamu Navigatornya!',
          summary: 'Dua hari untuk menjauh sejenak daripada kebisingan dan mengambil kawalan penuh ke atas hala tuju hidupmu.',
          media: '/uploads/ticw-batch-5.jpeg',
          date: '31 Oktober - 1 November 2026',
          duration: 'Bengkel 2 Hari',
          venue: 'Four Point Hotel Makassar',
          city: 'Indonesia',
          organizer: 'Pesan Cinta',
          poweredBy: 'Kemas Ki, Makanja Factory, dan Qofftea',
          trainers: 'Tunku Nina Mansur & Jonelle Huang',
          contacts: [
            { name: 'Vanny', phone: '+6281356676933' },
            { name: 'Zai', phone: '+60133097710' },
          ],
          cta: {
            label: 'Lihat workshop',
            href: '/the-inner-compass-workshop?batch=5',
            trackingTarget: 'inner-compass-workshop-batch-5',
          },
        },
      ],
    },
    footer: {
      statement: 'Semoga kita sentiasa mempunyai ruang untuk pulih, berhubung, dan pulang kepada cinta.',
      partnerLabel: 'Bersama Startup Global',
      copyright: '© 2026 Pesan Cinta',
    },
  },
};

