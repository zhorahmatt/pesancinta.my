import { whyParagraphs } from '../content/landing';

export function EmpathySection() {
  return (
    <section className="relative isolate overflow-hidden border-y border-white/10 bg-page-deep px-5 py-18 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
      <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-page to-transparent" aria-hidden="true" />

      <div className="mx-auto max-w-7xl">
        <div className="max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Why This Workshop</p>
          <h2 className="mt-5 font-serif text-[clamp(2.7rem,5.4vw,5.25rem)] font-semibold leading-[0.94] tracking-[-0.055em] text-primary">
            Untuk kamu yang terlalu lama kuat sendirian.
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted sm:whitespace-nowrap sm:text-xl sm:leading-9">
            Dari luar terlihat sanggup. Di dalam, tubuh mungkin sudah lama meminta jeda.
          </p>
        </div>

        <div className="mt-14 grid gap-4 border-t border-white/14 pt-6 sm:grid-cols-2 lg:grid-cols-4">
          {whyParagraphs.map((paragraph) => (
            <article key={paragraph} className="border-b border-white/14 pb-6 sm:border-b-0 sm:border-r sm:pr-5 sm:last:border-r-0 lg:pr-6">
              <p className="text-base leading-7 text-muted">{paragraph}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
