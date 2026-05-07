import { proofPhotos } from '../content/landing';

const photoLayouts = [
  'sm:col-span-2 lg:col-span-6 lg:row-span-2 min-h-[30rem] sm:min-h-[36rem] lg:min-h-[44rem]',
  'lg:col-span-3 min-h-72 sm:min-h-80 lg:min-h-[21.5rem]',
  'lg:col-span-3 min-h-72 sm:min-h-80 lg:min-h-[21.5rem]',
  'lg:col-span-3 min-h-72 sm:min-h-80 lg:min-h-[21.5rem]',
  'lg:col-span-3 min-h-72 sm:min-h-80 lg:min-h-[21.5rem]',
];

export function PhotoProof() {
  return (
    <section className="relative isolate overflow-hidden border-y border-white/10 bg-page-deep px-5 py-18 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
      <div className="absolute left-1/2 top-24 -z-10 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" aria-hidden="true" />

      <div className="mx-auto max-w-7xl">
        <div className="max-w-4xl" data-reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Inside The Room</p>
          <h2 className="mt-5 font-serif text-[clamp(2.7rem,5.4vw,5.25rem)] font-semibold leading-[0.94] tracking-[-0.055em] text-primary sm:whitespace-nowrap">
            Rasakan prosesnya.
          </h2>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-muted sm:whitespace-nowrap sm:text-xl sm:leading-9">
            Kamu akan bergerak, refleksi, berdiskusi, lalu pulang dengan rasa lebih ringan.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:auto-rows-fr">
          {proofPhotos.map((photo, index) => (
            <figure key={photo.src} className={`group relative overflow-hidden bg-page ${photoLayouts[index]}`} data-reveal>
              <img className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" src={photo.src} alt="" loading="lazy" />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
