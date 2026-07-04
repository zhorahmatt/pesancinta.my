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
import type {
  InnerCompassData,
  SectionKey,
  WorkshopLocale,
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

export function InnerCompassWorkshopPage() {
  const [data, setData] = useState<InnerCompassData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [locale, setLocale] = useState<WorkshopLocale>(getStoredLocale);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isMobileSwitcherVisible, setIsMobileSwitcherVisible] = useState(true);
  const [isScrollIdle, setIsScrollIdle] = useState(true);
  const [isHeroInView, setIsHeroInView] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);

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
  }, [data]);

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
  const registrationContact = data.contacts.find((contact) => contact.name === 'Amad') ?? data.contacts[0];
  const registrationUrl = createWhatsAppUrl(registrationContact.phone, content.registrationMessage);
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
          content={content.hero}
          event={data.event}
          registrationUrl={registrationUrl}
          onRegister={() => setIsRegisterOpen(true)}
        />
      </div>
      {orderedSections.map((section) => (
        <Fragment key={section.key}>{sectionRegistry[section.key]}</Fragment>
      ))}
      <ContactFooter
        content={content.footer}
        contacts={data.contacts}
        registrationMessage={content.registrationMessage}
      />
      <RegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        eventKey="inner-compass"
        locale={safeLocale}
        whatsappPhone={registrationContact.phone}
        registrationMessage={content.registrationMessage}
      />
    </main>
  );
}
