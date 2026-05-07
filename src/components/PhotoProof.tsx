import type { CSSProperties } from 'react';
import { proofPhotoGroups, type WorkshopContent } from '../content/landing';

type PhotoProofProps = {
  content: WorkshopContent['photoProof'];
};

const photoLayouts = [
  'aspect-[4/5] sm:col-span-2 lg:col-span-6 lg:row-span-2',
  'aspect-[4/5] lg:col-span-3',
  'aspect-[4/5] lg:col-span-3',
  'aspect-[4/5] lg:col-span-3',
  'aspect-[4/5] lg:col-span-3',
];

export function PhotoProof({ content }: PhotoProofProps) {
  return (
    <section className="relative isolate overflow-hidden border-y border-white/10 bg-page-deep px-5 py-18 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
      <div className="absolute left-1/2 top-24 -z-10 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" aria-hidden="true" />

      <div className="mx-auto max-w-7xl">
        <div className="max-w-4xl" data-reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">{content.eyebrow}</p>
          <h2 className="mt-5 font-serif text-[clamp(2.7rem,5.4vw,5.25rem)] font-semibold leading-[0.94] tracking-[-0.055em] text-primary sm:whitespace-nowrap">
            {content.headline}
          </h2>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-muted sm:whitespace-nowrap sm:text-xl sm:leading-9">
            {content.subheadline}
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:auto-rows-fr">
          {proofPhotoGroups.map((photos, index) => {
            const duration = photos.length * 4;

            return (
              <figure key={photos.join('-')} className={`group relative overflow-hidden border border-white/10 bg-page ${photoLayouts[index]}`} data-reveal>
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.03]">
                  {photos.map((photo, photoIndex) => (
                    <img
                      key={photo}
                      className="absolute inset-0 h-full w-full animate-[photo-proof-fade_var(--photo-duration)_ease-in-out_infinite] object-contain p-1"
                      src={photo}
                      alt=""
                      loading="lazy"
                      style={{
                        '--photo-duration': `${duration}s`,
                        animationDelay: `-${photoIndex * 4}s`,
                      } as CSSProperties}
                    />
                  ))}
                </div>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
