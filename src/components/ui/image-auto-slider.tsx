type ImageAutoSliderProps = {
  images: readonly string[];
  duration?: number;
};

export function ImageAutoSlider({ images, duration = 34 }: ImageAutoSliderProps) {
  const midpoint = Math.ceil(images.length / 2);
  const topRowImages = images.slice(0, midpoint);
  const bottomRowImages = images.slice(midpoint);
  const renderSliderRow = (rowImages: readonly string[], animationName: string, rowLabel: string) => {
    const duplicatedImages = [...rowImages, ...rowImages];

    return (
      <div
        className="flex w-max gap-4 will-change-transform sm:gap-5 lg:gap-6"
        style={{
          animation: `${animationName} ${duration}s linear infinite`,
        }}
      >
        {duplicatedImages.map((image, index) => (
          <figure
            key={`${rowLabel}-${image}-${index}`}
            className="group h-56 w-44 flex-shrink-0 overflow-hidden border border-white/10 bg-page shadow-[0_22px_70px_rgb(0_0_0_/_0.18)] sm:h-72 sm:w-56 lg:h-80 lg:w-64"
          >
            <img
              src={image}
              alt={`Workshop gallery ${rowLabel} ${(index % rowImages.length) + 1}`}
              loading="lazy"
              className="h-full w-full object-contain p-1 transition duration-500 group-hover:scale-[1.03] group-hover:brightness-110"
            />
          </figure>
        ))}
      </div>
    );
  };

  return (
    <div className="relative w-full overflow-hidden py-2 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
      <style>{`
        @keyframes ticw-image-auto-slider {
          0% {
            transform: translateX(0);
          }

          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes ticw-image-auto-slider-reverse {
          0% {
            transform: translateX(-50%);
          }

          100% {
            transform: translateX(0);
          }
        }
      `}</style>

      <div className="flex flex-col gap-4 sm:gap-5 lg:gap-6">
        {renderSliderRow(topRowImages, 'ticw-image-auto-slider', 'top')}
        {renderSliderRow(bottomRowImages.length > 0 ? bottomRowImages : topRowImages, 'ticw-image-auto-slider-reverse', 'bottom')}
      </div>
    </div>
  );
}
