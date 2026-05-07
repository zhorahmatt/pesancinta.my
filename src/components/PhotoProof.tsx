import { proofPhotos } from '../content/landing';

export function PhotoProof() {
  const featuredPhoto = proofPhotos[0];
  const activityPhotos = proofPhotos.slice(1);

  return (
    <section className="relative isolate overflow-hidden border-y border-white/10 bg-page-deep px-5 py-18 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
      <div className="absolute left-1/2 top-24 -z-10 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" aria-hidden="true" />

      <div className="mx-auto max-w-7xl">
        <div className="max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Inside The Room</p>
          <h2 className="mt-5 font-serif text-[clamp(2.7rem,5.4vw,5.25rem)] font-semibold leading-[0.94] tracking-[-0.055em] text-primary sm:whitespace-nowrap">
            Rasakan prosesnya.
          </h2>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-muted sm:whitespace-nowrap sm:text-xl sm:leading-9">
            Kamu akan bergerak, refleksi, berdiskusi, lalu pulang dengan rasa lebih ringan.
          </p>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <figure className="group relative min-h-[31rem] overflow-hidden bg-page sm:min-h-[38rem] lg:min-h-[44rem]">
            <img className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" src={featuredPhoto.src} alt={featuredPhoto.alt} loading="lazy" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(7_31_54_/_0.06),rgb(7_31_54_/_0.82)),linear-gradient(90deg,rgb(8_39_67_/_0.42),transparent_58%)]" aria-hidden="true" />
            <figcaption className="relative flex h-full min-h-[31rem] flex-col justify-between p-5 sm:min-h-[38rem] sm:p-7 lg:min-h-[44rem]">
              <span className="w-fit text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-accent">Suasana Ruang</span>
              <div className="max-w-lg">
                <p className="font-serif text-3xl font-semibold leading-[1.02] tracking-[-0.045em] text-primary sm:text-5xl">{featuredPhoto.title}</p>
                <p className="mt-4 max-w-md text-base leading-7 text-primary/78">{featuredPhoto.alt}</p>
              </div>
            </figcaption>
          </figure>

          <div className="grid gap-4 sm:grid-cols-2">
            {activityPhotos.map((photo, index) => (
              <figure key={`${photo.title}-${index}`} className={index === 1 ? 'group relative min-h-72 overflow-hidden bg-page sm:translate-y-8' : 'group relative min-h-72 overflow-hidden bg-page'}>
                <img className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" src={photo.src} alt={photo.alt} loading="lazy" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_34%,rgb(7_31_54_/_0.86))]" aria-hidden="true" />
                <figcaption className="relative flex h-full min-h-72 flex-col justify-between p-4">
                  <span className="w-fit border border-white/18 bg-page-deep/45 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-accent backdrop-blur">Di Dalam Ruang</span>
                  <div>
                    <p className="font-serif text-2xl font-semibold tracking-[-0.04em] text-primary">{photo.title}</p>
                    <p className="mt-2 text-sm leading-6 text-primary/76">{photo.alt}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
