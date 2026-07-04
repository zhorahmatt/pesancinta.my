import { useState } from 'react';
import type { WorkshopContent } from '../content/landing';
import { ImageAutoSlider } from './ui/image-auto-slider';

type PhotoProofProps = {
  content: WorkshopContent['photoProof'];
  proofPhotoGroups: string[][];
  batchThreePhotoGroups: string[][];
};

export function PhotoProof({ content, proofPhotoGroups, batchThreePhotoGroups }: PhotoProofProps) {
  const [activeBatch, setActiveBatch] = useState('all');
  const filters = [
    { label: 'All', value: 'all' },
    { label: 'Batch 3', value: 'batch-3' },
    { label: 'Batch 2', value: 'batch-2' },
  ];
  const batchThreeImages = batchThreePhotoGroups.flat();
  const batchTwoImages = proofPhotoGroups.flat();
  const galleryImages = {
    all: [
      batchThreeImages[0],
      batchTwoImages[5],
      batchThreeImages[7],
      batchTwoImages[10],
      batchThreeImages[2],
      batchTwoImages[1],
      batchThreeImages[9],
      batchTwoImages[13],
      batchThreeImages[4],
      batchTwoImages[8],
      ...batchThreeImages,
      ...batchTwoImages,
    ],
    'batch-3': batchThreeImages,
    'batch-2': batchTwoImages,
  };
  const sliderImages = galleryImages[activeBatch as keyof typeof galleryImages];

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

        <div className="mt-8">
          <ImageAutoSlider images={sliderImages} duration={120} />
        </div>
      </div>
    </section>
  );
}
