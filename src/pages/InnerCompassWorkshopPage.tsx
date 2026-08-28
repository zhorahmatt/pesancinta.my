import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react';
import { ContactFooter } from '../components/ContactFooter';
import { DesktopFloatingCta } from '../components/DesktopFloatingCta';
import { EmpathySection } from '../components/EmpathySection';
import { Fasilitas } from '../components/Fasilitas';
import { Hero } from '../components/Hero';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { MobileFloatingCta } from '../components/MobileFloatingCta';
import { PhotoProof } from '../components/PhotoProof';
import { RegistrationModal } from '../components/workshop/RegistrationModal';
import { TrainerProfiles } from '../components/TrainerProfiles';
import { WorkshopTestimonials } from '../components/WorkshopTestimonials';
import { WorkshopPillars } from '../components/WorkshopPillars';
import { fetchInnerCompassContent } from '../content/innerCompassData';
import {
  workshopBatches,
  type EventInfo,
  type InnerCompassData,
  type SectionKey,
  type WorkshopBatchId,
  type WorkshopLocale,
} from '../content/landing';
import { createWhatsAppUrl } from '../lib/whatsapp';

const localeStorageKey = 'inner-compass-workshop-locale';
const fallbackLocale: WorkshopLocale = 'ms';

function isWorkshopLocale(value: string | null): value is WorkshopLocale {
  return value === 'ms' || value === 'id' || value === 'en';
}

function getStoredLocale(): WorkshopLocale {
  if (typeof window === 'undefined') return fallbackLocale;

  try {
    const stored = window.localStorage.getItem(localeStorageKey);
    return isWorkshopLocale(stored) ? stored : fallbackLocale;
  } catch {
    return fallbackLocale;
  }
}

function getInitialBatch(): WorkshopBatchId {
  if (typeof window === 'undefined') return '4';
  const params = new URLSearchParams(window.location.search);
  const b = params.get('batch');
  if (b === '5' || b === 'batch-5') return '5';
  if (b === '4' || b === 'batch-4') return '4';
  if (window.location.hash.includes('batch-5')) return '5';
  if (window.location.hash.includes('batch-4')) return '4';
  return '4';
}

export function InnerCompassWorkshopPage() {
  const [data, setData] = useState<InnerCompassData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [locale, setLocale] = useState<WorkshopLocale>(getStoredLocale);
  const [batchId, setBatchId] = useState<WorkshopBatchId>(getInitialBatch);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isMobileSwitcherVisible, setIsMobileSwitcherVisible] = useState(true);
  const [isScrollIdle, setIsScrollIdle] = useState(true);
  const [isHeroInView, setIsHeroInView] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);

  const currentBatch = workshopBatches[batchId] ?? workshopBatches['4'];

  const handleBatchChange = (newBatch: WorkshopBatchId) => {
    setBatchId(newBatch);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('batch', newBatch);
      window.history.replaceState({}, '', url.toString());
    }
  };

  const batchOptions = [
    { id: '4' as const, label: 'Batch 4 · Kota Kinabalu' },
    { id: '5' as const, label: 'Batch 5 · Makassar' },
  ];

  useEffect(() => {
    let isMounted = true;
    fetchInnerCompassContent()
      .then((content) => {
        if (isMounted) setData(content);
      })
      .catch((error) => {
        if (isMounted) setLoadError(error instanceof Error ? error.message : 'Failed to load content.');
      });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(localeStorageKey, locale);
    } catch {
      // Ignore storage failures; language still updates for this session.
    }
  }, [locale]);

  useEffect(() => {
    const handlePopState = () => {
      setBatchId(getInitialBatch());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    let showTimer: number | undefined;

    const handleScroll = () => {
      const isMobile = window.matchMedia('(max-width: 639px)').matches;

      setIsScrollIdle(false);
      if (isMobile) setIsMobileSwitcherVisible(false);
      if (showTimer) window.clearTimeout(showTimer);
      showTimer = window.setTimeout(() => {
        setIsScrollIdle(true);
        if (isMobile) setIsMobileSwitcherVisible(true);
      }, 700);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (showTimer) window.clearTimeout(showTimer);
    };
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsHeroInView(entry.isIntersecting),
      { rootMargin: '0px 0px -68% 0px', threshold: 0 },
    );

    observer.observe(hero);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('[data-reveal]');

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.18 },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [data, batchId]);

  if (loadError) {
    return (
      <main className="grid min-h-svh place-items-center bg-page px-6 text-center text-primary">
        <div>
          <h1 className="font-serif text-3xl font-semibold">Inner Compass content is unavailable</h1>
          <p className="mt-3 text-sm text-primary/70">{loadError}</p>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="grid min-h-svh place-items-center bg-page text-primary">
        <div className="text-sm text-primary/70">Loading workshop…</div>
      </main>
    );
  }

  const safeLocale: WorkshopLocale = isWorkshopLocale(locale) && data.locales[locale] ? locale : data.defaultLocale;
  const content = data.locales[safeLocale];

  const effectiveEvent: EventInfo = {
    ...data.event,
    ...currentBatch.event,
  };

  const effectiveContacts = currentBatch.contacts.length > 0 ? currentBatch.contacts : data.contacts;
  const registrationContact = effectiveContacts[0];
  const effectiveRegistrationMessage = currentBatch.registrationMessage[safeLocale] ?? content.registrationMessage;
  const registrationUrl = createWhatsAppUrl(registrationContact.phone, effectiveRegistrationMessage);

  const heroContent = {
    ...content.hero,
    kicker: currentBatch.heroKicker[safeLocale] ?? content.hero.kicker,
    badge: currentBatch.badge,
  };

  const languageOptions = data.localeOrder.map((code) => ({
    locale: code,
    label: data.locales[code].label,
    name: data.locales[code].name,
  }));

  const sectionRegistry: Record<SectionKey, ReactNode> = {
    empathy: <EmpathySection content={content.empathy} />,
    pillars: <WorkshopPillars content={content.pillars} />,
    photoProof: (
      <PhotoProof
        content={content.photoProof}
        proofPhotoGroups={data.photoGroups.proof}
        batchThreePhotoGroups={data.photoGroups.batchThree}
      />
    ),
    testimonials: <WorkshopTestimonials content={content.testimonials} />,
    trainers: <TrainerProfiles content={content.trainers} />,
    fasilitas: <Fasilitas content={content.fasilitas} />,
  };

  const orderedSections = data.layout.filter((section) => section.visible);

  return (
    <main>
      <LanguageSwitcher locale={safeLocale} options={languageOptions} onChange={setLocale} isMobileVisible={isMobileSwitcherVisible} />
      <MobileFloatingCta href={registrationUrl} label={content.hero.ctaLabel} isVisible={isMobileSwitcherVisible && !isHeroInView} onRegister={() => setIsRegisterOpen(true)} />
      <DesktopFloatingCta href={registrationUrl} label={content.hero.ctaLabel} isVisible={isScrollIdle && !isHeroInView} onRegister={() => setIsRegisterOpen(true)} />
      <div ref={heroRef}>
        <Hero
          content={heroContent}
          event={effectiveEvent}
          registrationUrl={registrationUrl}
          onRegister={() => setIsRegisterOpen(true)}
          batch={batchId}
          onBatchChange={handleBatchChange}
          batches={batchOptions}
        />
      </div>
      {orderedSections.map((section) => (
        <Fragment key={section.key}>{sectionRegistry[section.key]}</Fragment>
      ))}
      <ContactFooter
        content={content.footer}
        contacts={effectiveContacts}
        registrationMessage={effectiveRegistrationMessage}
        organizerLogos={currentBatch.organizerLogos}
        sponsorLogos={currentBatch.sponsorLogos}
      />
      <RegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        eventKey={`inner-compass-batch-${batchId}`}
        locale={safeLocale}
        whatsappPhone={registrationContact.phone}
        registrationMessage={effectiveRegistrationMessage}
      />
    </main>
  );
}

