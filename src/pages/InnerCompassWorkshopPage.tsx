import { useEffect, useRef, useState } from 'react';
import { ContactFooter } from '../components/ContactFooter';
import { DesktopFloatingCta } from '../components/DesktopFloatingCta';
import { EmpathySection } from '../components/EmpathySection';
import { Hero } from '../components/Hero';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { MobileFloatingCta } from '../components/MobileFloatingCta';
import { PhotoProof } from '../components/PhotoProof';
import { TrainerProfiles } from '../components/TrainerProfiles';
import { WorkshopTestimonials } from '../components/WorkshopTestimonials';
import { WorkshopPillars } from '../components/WorkshopPillars';
import {
  contacts,
  defaultWorkshopLocale,
  workshopLocaleOrder,
  workshopLocales,
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
      <MobileFloatingCta href={registrationUrl} label={content.hero.ctaLabel} isVisible={isMobileSwitcherVisible && !isHeroInView} />
      <DesktopFloatingCta href={registrationUrl} label={content.hero.ctaLabel} isVisible={isScrollIdle && !isHeroInView} />
      <div ref={heroRef}>
        <Hero content={content.hero} registrationUrl={registrationUrl} />
      </div>
      <EmpathySection content={content.empathy} />
      <WorkshopPillars content={content.pillars} />
      <PhotoProof content={content.photoProof} />
      <WorkshopTestimonials content={content.testimonials} />
      <TrainerProfiles content={content.trainers} />
      <ContactFooter content={content.footer} registrationMessage={content.registrationMessage} />
    </main>
  );
}
