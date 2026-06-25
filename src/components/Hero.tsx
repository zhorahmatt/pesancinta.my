import { event, type WorkshopContent } from '../content/landing';
import { CtaButton } from './CtaButton';

type HeroProps = {
  content: WorkshopContent['hero'];
  registrationUrl: string;
};

export function Hero({ content, registrationUrl }: HeroProps) {
  const eventDetails = [
    [content.eventLabels.date, event.date],
    [content.eventLabels.venue, event.venue],
    [content.eventLabels.city, event.city],
  ];

  return (
    <header className="relative isolate min-h-svh overflow-hidden bg-page px-5 pt-0 pb-4 sm:px-8 sm:pb-7 lg:px-12 lg:pt-0 lg:pb-9">
      <video className="absolute inset-0 -z-40 h-full w-full object-cover opacity-85 saturate-95" autoPlay muted loop playsInline aria-hidden="true">
        <source src="/hero.webm" type="video/webm" />
      </video>
      <div className="hero-backdrop-drift absolute inset-0 -z-30 bg-[linear-gradient(90deg,rgb(13_60_89_/_0.54)_0%,rgb(13_60_89_/_0.18)_46%,rgb(13_60_89_/_0.42)_100%),linear-gradient(0deg,rgb(13_60_89_/_0.64)_0%,transparent_34%,rgb(13_60_89_/_0.28)_100%)]" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-64 bg-gradient-to-t from-page-deep to-transparent" aria-hidden="true" />

      <div className="mx-auto flex min-h-[calc(100svh-1rem)] max-w-7xl flex-col justify-between gap-6 sm:min-h-[calc(100vh-3.5rem)] sm:gap-12">
        <div className="hero-reveal hero-delay-1 -mt-3 flex items-center justify-between gap-4 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-primary/72 sm:-mt-6 sm:gap-6 sm:text-[0.68rem]">
          <div className="flex items-center" aria-label="Pesan Cinta">
            <img className="-ml-5 w-32 object-left sm:w-64" src="/pesancinta.png" alt="Pesan Cinta" />
          </div>
          <span className="max-w-56 text-right leading-5 sm:max-w-none">{content.eyebrow}</span>
        </div>

        <div className="max-w-5xl">
          <div className="hero-reveal hero-delay-2 mb-3 flex max-w-xl flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent sm:mb-6">
            <span>{content.kicker}</span>
            <span className="hidden h-px w-16 bg-accent/55 sm:block" aria-hidden="true" />
          </div>
          <h1 className="max-w-5xl font-serif text-[clamp(2.55rem,12.6vw,4.5rem)] font-semibold leading-[0.88] tracking-[-0.065em] text-primary drop-shadow-[0_1rem_3rem_rgb(0_0_0_/_0.32)] sm:text-[clamp(3.4rem,8.6vw,7.4rem)]">
            {content.headlineLines.map((line, index) => (
              <span key={line} className={`hero-line-reveal block ${index === 1 ? `hero-delay-4 text-accent ${line === 'You navigate it.' ? 'whitespace-nowrap' : ''}` : 'hero-delay-3'}`}>
                {line}
              </span>
            ))}
          </h1>
          <p className="hero-reveal hero-delay-5 mt-4 max-w-2xl text-base leading-7 text-primary/78 sm:mt-8 sm:text-xl">
            {content.subheadline}
          </p>
        </div>

        <div className="hero-reveal hero-delay-5 grid gap-4 border-t border-white/16 pt-4 sm:gap-6 sm:pt-6 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-start">
          <div className="order-2 flex w-full flex-col items-start gap-4 sm:items-center lg:order-1 lg:w-auto lg:flex-row lg:gap-5">
            <CtaButton
              href={registrationUrl}
              location="hero"
              targetName="registration-whatsapp"
              className="hero-cta-glow order-2 w-full px-8 py-5 text-base opacity-0 shadow-[0_22px_56px_rgb(243_198_81/0.28)] sm:min-w-72 sm:px-10 sm:py-5 sm:text-lg lg:order-1 lg:w-auto lg:px-9 lg:py-4 lg:text-base"
            >
              {content.ctaLabel}
            </CtaButton>
            <span className="order-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent sm:text-sm lg:order-2">{content.badge}</span>
          </div>
          <div className="order-1 grid max-w-3xl justify-items-start gap-3 text-xs sm:grid-cols-3 sm:items-start sm:gap-8 lg:order-2 lg:justify-self-end lg:justify-items-center">
            {eventDetails.map(([label, value]) => (
              <div key={label}>
                <div className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-accent">{label}</div>
                <div className="mt-1 font-semibold leading-5 text-primary/82">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
