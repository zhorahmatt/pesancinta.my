import { trainers } from '../content/landing';

const trainerPhotos = ['/nina.png', '/joe.png'];

function InstagramIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17" cy="7" r="1" fill="currentColor" />
    </svg>
  );
}

export function TrainerProfiles() {
  return (
    <section className="relative isolate overflow-hidden bg-page px-5 py-18 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-4xl" data-reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Who's Teaching</p>
          <h2 className="mt-5 font-serif text-[clamp(2.7rem,5.4vw,5.25rem)] font-semibold leading-[0.94] tracking-[-0.055em] text-primary sm:whitespace-nowrap">
            Kenali trainer workshop ini.
          </h2>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-muted sm:whitespace-nowrap sm:text-xl sm:leading-9">
            Dua trainer menjaga proses tetap tenang, jelas, dan aman untuk jujur.
          </p>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-2 lg:items-stretch">
          {trainers.map((trainer, index) => (
            <article key={trainer.name} className="border-t border-white/14 pt-6" data-reveal>
              <div className="grid h-full gap-6 sm:grid-cols-[minmax(8rem,11rem)_1fr] sm:items-stretch">
                <div className="aspect-[4/5] overflow-hidden bg-[linear-gradient(145deg,rgb(243_198_81_/_0.16),rgb(255_255_255_/_0.035))]">
                  <img className="h-full w-full object-cover" src={trainerPhotos[index]} alt={trainer.name} loading="lazy" />
                </div>
                <div className="flex h-full flex-col justify-between">
                  <div>
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-accent">Trainer</p>
                    <h3 className="mt-4 font-serif text-4xl font-semibold leading-none tracking-[-0.045em] text-primary sm:text-5xl">{trainer.name}</h3>
                  </div>
                  <a className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-muted transition-colors duration-200 hover:text-accent" href="#" aria-label={`Instagram ${trainer.name}`}>
                    <InstagramIcon />
                    Instagram
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
