import { useEffect, useRef, useState } from 'react';
import type { WorkshopLocale } from '../content/landing';

type LanguageSwitcherProps = {
  locale: WorkshopLocale;
  options: readonly { locale: WorkshopLocale; label: string; name: string }[];
  onChange: (locale: WorkshopLocale) => void;
  isMobileVisible: boolean;
};

const localeIcons: Record<WorkshopLocale, string> = {
  ms: '🇲🇾',
  id: '🇮🇩',
  en: '🌐',
};

export function LanguageSwitcher({ locale, options, onChange, isMobileVisible }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const switcherRef = useRef<HTMLElement>(null);
  const activeOption = options.find((option) => option.locale === locale) ?? options[0];

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!switcherRef.current?.contains(event.target as Node)) setIsOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <nav
      ref={switcherRef}
      className={`fixed bottom-24 right-4 z-50 transition duration-300 sm:bottom-auto sm:right-6 sm:top-1/2 sm:-translate-y-1/2 ${
        isMobileVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none sm:pointer-events-auto sm:translate-y-0 sm:opacity-100'
      }`}
      aria-label="Language selector"
    >
      <div className="relative flex flex-col items-end gap-2 sm:items-center">
        <div
          className={`absolute bottom-14 right-0 flex flex-col-reverse gap-2 transition duration-300 sm:bottom-auto sm:right-14 sm:top-1/2 sm:-translate-y-1/2 sm:flex-row ${
            isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none translate-y-2 opacity-0 sm:translate-x-2 sm:translate-y-0'
          }`}
        >
          {options.map((option, index) => {
            const isActive = option.locale === locale;

            return (
              <button
                key={option.locale}
                type="button"
                aria-pressed={isActive}
                aria-label={`Switch language to ${option.name}`}
                title={option.name}
                onClick={() => {
                  onChange(option.locale);
                  setIsOpen(false);
                }}
                className={`grid h-12 w-12 place-items-center border text-xl shadow-soft backdrop-blur-md transition duration-300 focus-visible:outline-accent ${
                  isActive
                    ? 'border-accent bg-accent text-ink'
                    : 'border-white/14 bg-page-deep/88 hover:border-accent/55 hover:bg-white/10'
                } ${isOpen ? 'scale-100' : 'scale-90'}`}
                style={{ transitionDelay: isOpen ? `${index * 45}ms` : '0ms' }}
              >
                <span aria-hidden="true">{localeIcons[option.locale]}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          aria-expanded={isOpen}
          aria-label={`Current language ${activeOption.name}. Open language selector`}
          title="Change language"
          onClick={() => setIsOpen((current) => !current)}
          className="grid h-13 w-13 place-items-center border border-accent/55 bg-page-deep/90 text-2xl shadow-soft backdrop-blur-md transition duration-200 hover:border-accent hover:bg-white/10 focus-visible:outline-accent"
        >
          <span aria-hidden="true">{localeIcons[locale]}</span>
        </button>
      </div>
    </nav>
  );
}
