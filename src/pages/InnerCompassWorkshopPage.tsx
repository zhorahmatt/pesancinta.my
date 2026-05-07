import { useEffect } from 'react';
import { ContactFooter } from '../components/ContactFooter';
import { EmpathySection } from '../components/EmpathySection';
import { Hero } from '../components/Hero';
import { PhotoProof } from '../components/PhotoProof';
import { TrainerProfiles } from '../components/TrainerProfiles';
import { WorkshopPillars } from '../components/WorkshopPillars';

export function InnerCompassWorkshopPage() {
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
      <Hero />
      <EmpathySection />
      <WorkshopPillars />
      <PhotoProof />
      <TrainerProfiles />
      <ContactFooter />
    </main>
  );
}
