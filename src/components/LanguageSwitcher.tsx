import type { WorkshopLocale } from '../content/landing';

type LanguageSwitcherProps = {
  locale: WorkshopLocale;
  options: readonly { locale: WorkshopLocale; label: string; name: string }[];
  onChange: (locale: WorkshopLocale) => void;
};

export function LanguageSwitcher({ locale, options, onChange }: LanguageSwitcherProps) {
  return (
    <nav
      className="fixed inset-x-0 bottom-4 z-50 mx-auto flex w-fit items-center gap-2 border border-white/14 bg-page-deep/88 px-2 py-2 shadow-soft backdrop-blur-md sm:inset-x-auto sm:bottom-auto sm:right-6 sm:top-1/2 sm:-translate-y-1/2 sm:flex-col sm:px-2 sm:py-3"
      aria-label="Language selector"
    >
      <span className="hidden [writing-mode:vertical-rl] text-[0.6rem] font-bold uppercase tracking-[0.22em] text-accent/80 sm:block">
        Language
      </span>
      <span className="h-px w-6 bg-white/18 sm:h-6 sm:w-px" aria-hidden="true" />
      <div className="flex gap-1 sm:flex-col">
        {options.map((option) => {
          const isActive = option.locale === locale;

          return (
            <button
              key={option.locale}
              type="button"
              aria-pressed={isActive}
              aria-label={`Switch language to ${option.name}`}
              title={option.name}
              onClick={() => onChange(option.locale)}
              className={`grid h-10 min-w-11 place-items-center border text-xs font-bold uppercase tracking-[0.16em] transition duration-200 focus-visible:outline-accent sm:h-11 sm:min-w-10 ${
                isActive
                  ? 'border-accent bg-accent text-ink shadow-[0_10px_28px_rgb(243_198_81/0.22)]'
                  : 'border-white/10 bg-white/[0.035] text-primary/75 hover:border-accent/45 hover:bg-white/10 hover:text-primary'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
