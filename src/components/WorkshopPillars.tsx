import { pillars } from '../content/landing';

export function WorkshopPillars() {
  return (
    <section className="relative isolate overflow-hidden bg-page px-5 py-18 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Workshop Benefits</p>
          <h2 className="mt-5 font-serif text-[clamp(2.7rem,5.4vw,5.25rem)] font-semibold leading-[0.94] tracking-[-0.055em] text-primary">
            Saatnya menentukan <span className="text-accent">kompas</span> hidupmu
          </h2>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-muted sm:whitespace-nowrap sm:text-xl sm:leading-9">
            Berani melangkah, nikmati prosesnya menuju versi terbaik diri
          </p>
        </div>

        <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="group flex min-h-52 flex-col justify-between border border-white/14 bg-white/[0.025] p-5 transition-colors duration-300 hover:border-accent/45 hover:bg-white/[0.045]">
              <h3 className="font-serif text-2xl font-semibold leading-[1.05] tracking-[-0.04em] text-primary sm:text-3xl">
                {pillar.title}
              </h3>
              <p className="mt-8 text-base leading-7 text-muted">{pillar.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
