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
import {
  contacts,
  defaultWorkshopLocale,
  sectionLayout,
  workshopLocaleOrder,
  workshopLocales,
  type SectionKey,
  type WorkshopLocale,
} from '../content/landing';
import { createWhatsAppUrl } from '../lib/whatsapp';

const localeStorageKey = 'inner-compass-workshop-locale';

function isWorkshopLocale(value: string | null): value is WorkshopLocale {
  return value !== null && value in workshopLocales;
}

function getInitialLocale(): WorkshopLocale {
  if (typeof window === 'undefined') return defaultWorkshopLocale;

  try {
    const storedLocale = window.localStorage.getItem(localeStorageKey);
    return isWorkshopLocale(storedLocale) ? storedLocale : defaultWorkshopLocale;
  } catch {
    return defaultWorkshopLocale;
  }
}

export function InnerCompassWorkshopPage() {
  const [locale, setLocale] = useState<WorkshopLocale>(getInitialLocale);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isMobileSwitcherVisible, setIsMobileSwitcherVisible] = useState(true);
  const [isScrollIdle, setIsScrollIdle] = useState(true);
  const [isHeroInView, setIsHeroInView] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const content = workshopLocales[locale];
  const registrationUrl = createWhatsAppUrl(contacts[0].phone, content.registrationMessage);
  const languageOptions = workshopLocaleOrder.map((locale) => ({
    locale,
    label: workshopLocales[locale].label,
    name: workshopLocales[locale].name,
  }));

  const sectionRegistry: Record<SectionKey, ReactNode> = {
    empathy: <EmpathySection content={content.empathy} />,
    pillars: <WorkshopPillars content={content.pillars} />,
    photoProof: <PhotoProof content={content.photoProof} />,
    testimonials: <WorkshopTestimonials content={content.testimonials} />,
    trainers: <TrainerProfiles content={content.trainers} />,
    fasilitas: <Fasilitas content={content.fasilitas} />,
  };

  const orderedSections = sectionLayout.filter((section) => section.visible);

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
  }, []);

  return (
    <main>
      <LanguageSwitcher locale={locale} options={languageOptions} onChange={setLocale} isMobileVisible={isMobileSwitcherVisible} />
      <MobileFloatingCta href={registrationUrl} label={content.hero.ctaLabel} isVisible={isMobileSwitcherVisible && !isHeroInView} onRegister={() => setIsRegisterOpen(true)} />
      <DesktopFloatingCta href={registrationUrl} label={content.hero.ctaLabel} isVisible={isScrollIdle && !isHeroInView} onRegister={() => setIsRegisterOpen(true)} />
      <div ref={heroRef}>
        <Hero content={content.hero} registrationUrl={registrationUrl} onRegister={() => setIsRegisterOpen(true)} />
      </div>
      {orderedSections.map((section) => (
        <Fragment key={section.key}>{sectionRegistry[section.key]}</Fragment>
      ))}
      <ContactFooter content={content.footer} registrationMessage={content.registrationMessage} />
      <RegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        eventKey="inner-compass"
        locale={locale}
        whatsappPhone={contacts[0].phone}
        registrationMessage={content.registrationMessage}
      />
    </main>
  );
}
