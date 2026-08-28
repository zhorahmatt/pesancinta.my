import { Fragment, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  defaultHomeLocale,
  homeLocaleOrder,
  homeLocales,
  type HomeLocale,
} from '../content/pesanCintaHome';
import { trackCtaClick } from '../lib/tracking';

const localeStorageKey = 'pesan-cinta-home-locale';

const heroMarqueePhotos = ['/g1.jpeg', '/g6.jpeg', '/g11.jpeg', '/g12.jpeg', '/g16.jpeg', '/g17.jpeg'];

const heroEntrance = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 100, damping: 20 },
  },
};

function isHomeLocale(value: string | null): value is HomeLocale {
  return value !== null && value in homeLocales;
}

function getInitialLocale(): HomeLocale {
  if (typeof window === 'undefined') return defaultHomeLocale;

  try {
    const storedLocale = window.localStorage.getItem(localeStorageKey);
    return isHomeLocale(storedLocale) ? storedLocale : defaultHomeLocale;
  } catch {
    return defaultHomeLocale;
  }
}

export function PesanCintaHomePage() {
  const [locale, setLocale] = useState<HomeLocale>(getInitialLocale);
  const [menuOpen, setMenuOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const content = homeLocales[locale];
  const marqueePhotos = [...heroMarqueePhotos, ...heroMarqueePhotos];

  useEffect(() => {
    document.documentElement.lang = locale;

    try {
      window.localStorage.setItem(localeStorageKey, locale);
    } catch {
      // The page remains fully usable when browser storage is unavailable.
    }
  }, [locale]);

  return (
    <main className="pesan-cinta-page">
      <header className="sticky top-4 z-50 mx-auto w-[calc(100%-2rem)] max-w-4xl rounded-2xl border border-white/10 bg-page-deep/80 shadow-2xl backdrop-blur-2xl">
        <nav className="flex items-center justify-between px-2 py-1.5 sm:px-4 sm:py-2">
          <a href="#utama" className="flex items-center gap-1 rounded-lg px-1 py-1 transition-colors hover:bg-white/5 sm:gap-2 sm:px-1.5" aria-label="Pesan Cinta">
            <img className="h-20 w-20 -my-6 object-contain sm:h-32 sm:w-32 sm:-my-11" src="/pesancinta.png" alt="Pesan Cinta" />
          </a>

          <div className="hidden items-center gap-0.5 md:flex">
            <a href="#tentang" className="rounded-lg px-3 py-1.5 text-sm font-medium text-primary/72 transition-colors hover:bg-white/5 hover:text-accent">{content.navigation.about}</a>
            <a href="#misi" className="rounded-lg px-3 py-1.5 text-sm font-medium text-primary/72 transition-colors hover:bg-white/5 hover:text-accent">{content.navigation.missions}</a>
            <a href="#kegiatan" className="rounded-lg px-3 py-1.5 text-sm font-medium text-primary/72 transition-colors hover:bg-white/5 hover:text-accent">{content.navigation.activities}</a>
          </div>

          <div className="flex items-center gap-2">
            <div className="pc-language-toggle" aria-label="Pilihan bahasa">
              {homeLocaleOrder.map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={locale === option}
                  onClick={() => setLocale(option)}
                >
                  {option.toUpperCase()}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="inline-flex md:hidden items-center justify-center rounded-lg border border-white/10 p-2 text-primary/72 transition-colors hover:bg-white/5 hover:text-accent"
              aria-label="Buka menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden" onClick={() => setMenuOpen(false)} />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed right-0 top-0 z-50 flex h-full w-72 flex-col border-l border-white/10 bg-page-deep/95 backdrop-blur-2xl md:hidden"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <span className="text-sm font-semibold text-primary/60">Menu</span>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg p-1.5 text-primary/72 transition-colors hover:bg-white/5 hover:text-accent"
                  aria-label="Tutup menu"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>
              <div className="flex flex-col gap-1 px-3 pt-4">
                <a href="#tentang" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2.5 text-base font-medium text-primary/72 transition-colors hover:bg-white/5 hover:text-accent">{content.navigation.about}</a>
                <a href="#misi" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2.5 text-base font-medium text-primary/72 transition-colors hover:bg-white/5 hover:text-accent">{content.navigation.missions}</a>
                <a href="#kegiatan" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2.5 text-base font-medium text-primary/72 transition-colors hover:bg-white/5 hover:text-accent">{content.navigation.activities}</a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <section id="utama" className="pc-hero pc-hero-marquee" aria-labelledby="pc-hero-title">
        <div className="pc-hero-content">
          <motion.p initial="hidden" animate="show" variants={heroEntrance} className="pc-hero-pill">
            {content.hero.label}
          </motion.p>

          <motion.h1
            id="pc-hero-title"
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.075 } } }}
          >
            {content.hero.headline.split(' ').map((word, index, words) => (
              <Fragment key={`${word}-${index}`}>
                <motion.span variants={heroEntrance} className="pc-hero-word">
                  {word}
                </motion.span>
                {index < words.length - 1 && ' '}
              </Fragment>
            ))}
          </motion.h1>

          <motion.p initial="hidden" animate="show" variants={heroEntrance} transition={{ delay: 0.35 }} className="pc-lead">
            {content.hero.summary}
          </motion.p>

          <motion.a
            initial="hidden"
            animate="show"
            variants={heroEntrance}
            transition={{ delay: 0.45 }}
            whileHover={prefersReducedMotion ? undefined : { scale: 1.03 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
            className="pc-cta"
            href={content.hero.cta.href}
            onClick={() => trackCtaClick({ location: 'home-hero', target: content.hero.cta.trackingTarget })}
          >
            {content.hero.cta.label}
          </motion.a>
        </div>

        <div className="pc-hero-marquee-band" aria-hidden="true">
          <motion.div
            className="pc-hero-marquee-track"
            initial={prefersReducedMotion ? false : { x: '-50%' }}
            animate={prefersReducedMotion ? undefined : { x: ['-50%', '0%'] }}
            transition={prefersReducedMotion ? undefined : { ease: 'linear', duration: 40, repeat: Infinity }}
          >
            {marqueePhotos.map((photo, index) => (
              <figure
                key={`${photo}-${index}`}
                className="pc-hero-marquee-card"
                style={{ transform: `rotate(${index % 2 === 0 ? -2 : 4}deg)` }}
              >
                <img src={photo} alt="" loading={index < heroMarqueePhotos.length ? 'eager' : 'lazy'} />
              </figure>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="tentang" className="pc-section pc-about" aria-labelledby="pc-about-title">
        <div className="pc-shell pc-about-grid">
          <p className="pc-kicker">{content.about.label}</p>
          <div>
            <h2 id="pc-about-title">{content.about.title}</h2>
            {content.about.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="pc-shell pc-about-founders" aria-label="Pendiri Pesan Cinta">
          <p className="pc-about-tagline">We stand for a World where love leads, heals and connect us.</p>
          <div className="pc-founder-portraits">
            <figure className="pc-founder-portrait pc-founder-mimi">
              <img src="/mimi.png" alt="Mimi, pendiri Pesan Cinta" loading="lazy" />
            </figure>
            <figure className="pc-founder-portrait pc-founder-zai">
              <img src="/zai.png" alt="Zai, pendiri Pesan Cinta" loading="lazy" />
            </figure>
          </div>
        </div>
      </section>

      <section id="misi" className="pc-section pc-missions" aria-labelledby="pc-missions-title">
        <div className="pc-shell">
          <div className="pc-section-heading">
            <p className="pc-kicker">{content.missions.label}</p>
            <h2 id="pc-missions-title">{content.missions.title}</h2>
          </div>

          <div className="pc-mission-grid">
            <article className="pc-mission-featured">
              <img src={content.missions.featured.media} alt="Peserta mengikuti sesi Pesan Cinta" loading="lazy" />
              <div>
                <h3>{content.missions.featured.title}</h3>
                <p>{content.missions.featured.description}</p>
              </div>
            </article>

            <div className="pc-mission-supporting">
              {content.missions.supporting.map((mission) => (
                <article key={mission.title}>
                  <h3>{mission.title}</h3>
                  <p>{mission.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="kegiatan" className="pc-section pc-activities" aria-labelledby="pc-activities-title">
        <div className="pc-shell">
          <div className="pc-section-heading">
            <p className="pc-kicker">{content.activities.label}</p>
            <h2 id="pc-activities-title">{content.activities.title}</h2>
          </div>

          <div className="pc-past-event">
            <div className="pc-past-copy">
              <p className="pc-event-label">{content.activities.past.label}</p>
              <h3>{content.activities.past.title}</h3>
              <p>{content.activities.past.summary}</p>
            </div>
            <div className="pc-gallery" aria-label={content.activities.past.title}>
              {content.activities.past.gallery?.map((photo, index) => (
                <img
                  key={photo}
                  className={`pc-gallery-image pc-gallery-image-${index + 1}`}
                  src={photo}
                  alt="Kegiatan dan perjumpaan Pesan Cinta"
                  loading="lazy"
                />
              ))}
            </div>
          </div>

          <article className="pc-upcoming-event">
            <img src={content.activities.upcoming.media} alt="Kegiatan workshop Pesan Cinta" loading="lazy" />
            <div className="pc-upcoming-copy">
              <p className="pc-event-label">{content.activities.upcoming.label}</p>
              <h3>{content.activities.upcoming.title}</h3>
              <p>{content.activities.upcoming.summary}</p>
              <dl className="pc-event-details">
                <div>
                  <dt>{content.activities.detailsLabels.date}</dt>
                  <dd>{content.activities.upcoming.date}</dd>
                </div>
                <div>
                  <dt>{content.activities.detailsLabels.venue}</dt>
                  <dd>{content.activities.upcoming.venue}</dd>
                </div>
                <div>
                  <dt>{content.activities.detailsLabels.city}</dt>
                  <dd>{content.activities.upcoming.city}</dd>
                </div>
              </dl>
              {content.activities.upcoming.cta && (
                <a
                  className="pc-cta"
                  href={content.activities.upcoming.cta.href}
                  onClick={() =>
                    trackCtaClick({
                      location: 'home-upcoming-event',
                      target: content.activities.upcoming.cta!.trackingTarget,
                    })
                  }
                >
                  {content.activities.upcoming.cta.label}
                </a>
              )}
            </div>
          </article>
        </div>
      </section>

      <footer className="w-full border-t border-white/10 bg-gradient-to-b from-page to-page-deep text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 flex flex-col items-center sm:py-20">
          <div className="flex items-center justify-center gap-5 mb-6">
            <img className="h-36 w-36 -my-10 object-contain sm:h-40 sm:w-40 sm:-my-10" src="/pesancinta.png" alt="Pesan Cinta" />
            <div className="h-12 w-px bg-white/10" />
            <img className="h-32 w-32 -my-8 object-contain sm:h-36 sm:w-36 sm:-my-8" src="/startupglobal.png" alt="Startup Global" />
          </div>
          <p className="max-w-xl text-center text-sm font-normal leading-relaxed text-primary/80">
            {content.footer.statement}
          </p>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto max-w-7xl px-6 py-5 flex flex-col items-center gap-2 text-center text-xs font-medium text-primary/60 sm:flex-row sm:justify-between">
            <span>{content.footer.copyright}</span>
            <a
              href="/uploads/ssm.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-primary/40 transition-colors hover:text-accent"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
              SSM Verified Business
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
