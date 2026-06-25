import { useState, type CSSProperties } from 'react';
import { batchThreePhotoGroups, proofPhotoGroups, type WorkshopContent } from '../content/landing';
import { FlipReveal, FlipRevealItem } from './ui/flip-reveal';

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

const allPhotoLayouts = [
  ...photoLayouts,
  'aspect-[4/5] sm:col-span-2 lg:col-start-7 lg:col-span-6 lg:row-span-2',
  'aspect-[4/5] lg:col-span-3',
  'aspect-[4/5] lg:col-span-3',
  'aspect-[4/5] lg:col-span-3',
  'aspect-[4/5] lg:col-span-3',
];

export function PhotoProof({ content }: PhotoProofProps) {
  const [activeBatch, setActiveBatch] = useState('all');
  const [loadedCards, setLoadedCards] = useState<Record<string, boolean>>({});
  const filters = [
    { label: 'All', value: 'all' },
    { label: 'Batch 3', value: 'batch-3' },
    { label: 'Batch 2', value: 'batch-2' },
  ];
  const photos = [
    ...batchThreePhotoGroups.map((items) => ({ batch: 'batch-3', items })),
    ...proofPhotoGroups.map((items) => ({ batch: 'batch-2', items })),
  ];
  const markCardLoaded = (cardId: string) => {
    setLoadedCards((current) => ({
      ...current,
      [cardId]: true,
    }));
  };

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

        <div className="mt-10 flex flex-wrap gap-2" role="group" aria-label="Filter gallery workshop" data-reveal>
          {filters.map((filter) => {
            const isActive = filter.value === activeBatch;

            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => setActiveBatch(filter.value)}
                aria-pressed={isActive}
                className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition duration-200 ${
                  isActive
                    ? 'border-accent bg-accent text-ink shadow-[0_10px_30px_rgb(243_198_81_/_0.2)]'
                    : 'border-white/15 bg-white/5 text-primary hover:border-accent/60 hover:bg-white/10'
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <FlipReveal
          className="mt-6 grid grid-flow-dense gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:auto-rows-fr"
          keys={[activeBatch]}
          showClass="block"
          hideClass="hidden"
        >
          {photos.map((photo, index) => {
            const duration = photo.items.length * 4;
            const layouts = activeBatch === 'all' ? allPhotoLayouts : photoLayouts;
            const cardId = `${photo.batch}-${photo.items.join('-')}`;
            const isLoaded = loadedCards[cardId];

            return (
              <FlipRevealItem
                key={cardId}
                flipKey={photo.batch}
                className={`group relative overflow-hidden border border-white/10 bg-page ${layouts[index % layouts.length]}`}
              >
                <div
                  aria-hidden="true"
                  className={`absolute inset-0 bg-gradient-to-br from-surface/70 via-page/80 to-page-deep transition-opacity duration-500 ${
                    isLoaded ? 'opacity-0' : 'animate-pulse opacity-100'
                  }`}
                >
                  <div className="absolute inset-x-4 top-4 h-2 rounded-full bg-white/10" />
                  <div className="absolute inset-x-5 bottom-8 h-3 rounded-full bg-accent/25" />
                  <div className="absolute bottom-4 left-1/2 h-2 w-1/3 -translate-x-1/2 rounded-full bg-white/15" />
                </div>
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.03]">
                  {photo.items.map((image, photoIndex) => (
                    <img
                      key={image}
                      className={`absolute inset-0 h-full w-full animate-[photo-proof-fade_var(--photo-duration)_ease-in-out_infinite] object-contain p-1 transition-opacity duration-500 ${
                        isLoaded ? 'opacity-100' : 'opacity-0'
                      }`}
                      src={image}
                      alt=""
                      loading="lazy"
                      onLoad={() => markCardLoaded(cardId)}
                      style={{
                        '--photo-duration': `${duration}s`,
                        animationDelay: `-${photoIndex * 4}s`,
                      } as CSSProperties}
                    />
                  ))}
                </div>
              </FlipRevealItem>
            );
          })}
        </FlipReveal>
      </div>
    </section>
  );
}
