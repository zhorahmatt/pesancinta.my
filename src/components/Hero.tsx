import { event, hero, registrationUrl } from '../content/landing';
import { CtaButton } from './CtaButton';

export function Hero() {
  const headlineLines = ['Hidupmu,', 'Kamu Navigatornya.'];
  const eventDetails = [
    ['Tanggal', event.date],
    ['Tempat', event.venue],
    ['Kota', event.city],
  ];

  return (
    <header className="relative isolate min-h-screen overflow-hidden bg-page px-5 pt-0 pb-7 sm:px-8 lg:px-12 lg:pt-0 lg:pb-9">
      <video className="absolute inset-0 -z-40 h-full w-full object-cover opacity-85 saturate-95" autoPlay muted loop playsInline aria-hidden="true">
        <source src="/hero.webm" type="video/webm" />
      </video>
      <div className="absolute inset-0 -z-30 bg-[linear-gradient(90deg,rgb(8_39_67_/_0.62)_0%,rgb(8_39_67_/_0.24)_46%,rgb(8_39_67_/_0.5)_100%),linear-gradient(0deg,rgb(7_31_54_/_0.78)_0%,transparent_34%,rgb(7_31_54_/_0.34)_100%)]" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-64 bg-gradient-to-t from-page-deep to-transparent" aria-hidden="true" />

      <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-7xl flex-col justify-between gap-12">
        <div className="-mt-4 flex items-center justify-between gap-6 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-primary/72 sm:-mt-6">
          <div className="flex items-center" aria-label="Pesan Cinta">
            <img className="w-48 sm:w-64 ml-[-20px] object-left" src="/pesancinta.png" alt="Pesan Cinta" />
          </div>
          <span className="max-w-56 text-right leading-5 sm:max-w-none">{hero.eyebrow}</span>
        </div>

        <div className="max-w-5xl">
          <div className="mb-6 flex max-w-xl flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            <span>Mulai Hari Ini</span>
            <span className="hidden h-px w-16 bg-accent/55 sm:block" aria-hidden="true" />
          </div>
          <h1 className="max-w-5xl font-serif text-[clamp(3.4rem,8.6vw,7.4rem)] font-semibold leading-[0.88] tracking-[-0.065em] text-primary drop-shadow-[0_1rem_3rem_rgb(0_0_0_/_0.32)]">
            {headlineLines.map((line, index) => (
              <span key={line} className={index === 1 ? 'block text-accent' : 'block'}>
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-primary/78 sm:text-xl">
            Saat hidup terasa dikendalikan tuntutan, tubuh sering tahu arah pulang sebelum pikiran berani mengakuinya.
          </p>
        </div>

        <div className="grid gap-6 border-t border-white/16 pt-6 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-start">
          <div className="flex flex-wrap items-center gap-4">
            <CtaButton href={registrationUrl} location="hero" targetName="registration-whatsapp" className="sm:min-w-56">
              {hero.ctaLabel}
            </CtaButton>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{hero.badge}</span>
          </div>
          <div className="grid max-w-3xl justify-items-center gap-5 text-center text-xs sm:grid-cols-3 sm:items-start sm:gap-8 lg:justify-self-end">
            {/* <div className="font-semibold leading-6 text-primary/78">
              2 hari untuk berhenti sejenak dan kembali menentukan arah.
            </div> */}
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
