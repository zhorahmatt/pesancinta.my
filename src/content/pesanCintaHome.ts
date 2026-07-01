export type HomeLocale = 'id' | 'ms';

export type HomeCta = {
  label: string;
  href: string;
  trackingTarget: string;
};

export type HomeEvent = {
  label: string;
  title: string;
  summary: string;
  media: string;
  gallery?: readonly string[];
  date?: string;
  venue?: string;
  city?: string;
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
    };
    past: HomeEvent;
    upcoming: HomeEvent;
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
        venue: 'Tempat',
        city: 'Kota',
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
        summary: 'Dua hari untuk menepi dari kebisingan, mengenali kembali arahmu, dan bertumbuh lewat refleksi, gerak, serta kebersamaan.',
        media: '/ticw_pekanbaru.jpeg',
        date: '29-30 Agustus 2026',
        venue: 'To be confirmed',
        city: 'Pekanbaru, Indonesia',
        cta: {
          label: 'Lihat workshop',
          href: '/the-inner-compass-workshop',
          trackingTarget: 'inner-compass-workshop',
        },
      },
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
        venue: 'Tempat',
        city: 'Kota',
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
        summary: 'Dua hari untuk menjauh sejenak daripada kebisingan, mengenali kembali arahmu, dan bertumbuh melalui refleksi, gerak, serta kebersamaan.',
        media: '/ticw_pekanbaru.jpeg',
        date: '29-30 Ogos 2026',
        venue: 'To be confirmed',
        city: 'Pekanbaru, Indonesia',
        cta: {
          label: 'Lihat workshop',
          href: '/the-inner-compass-workshop',
          trackingTarget: 'inner-compass-workshop',
        },
      },
    },
    footer: {
      statement: 'Semoga kita sentiasa mempunyai ruang untuk pulih, berhubung, dan pulang kepada cinta.',
      partnerLabel: 'Bersama Startup Global',
      copyright: '© 2026 Pesan Cinta',
    },
  },
};
