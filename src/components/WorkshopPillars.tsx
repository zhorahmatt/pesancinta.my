import type { WorkshopContent } from '../content/landing';

type WorkshopPillarsProps = {
  content: WorkshopContent['pillars'];
};

const benefitImages = Array.from({ length: 4 }, (_, index) => {
  if (index === 0) {
    return ['/benefit/experienced-professional-trainers.jpeg', '/benefit/experienced-professional-trainers-jonelle.jpeg'];
  }

  if (index === 1) {
    return ['/benefit/experience-based-training.jpeg', '/benefit/experience-based-training.jpeg'];
  }

  if (index === 2) {
    return ['/benefit/interactive-training.jpeg', '/benefit/interactive-training.jpeg'];
  }

  const pillarNumber = index + 1;

  return [`/benefit/b${pillarNumber}1.jpeg`, `/benefit/b${pillarNumber}2.jpeg`];
});

export function WorkshopPillars({ content }: WorkshopPillarsProps) {
  return (
    <section className="relative isolate overflow-hidden bg-page px-5 py-18 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
      <div className="absolute inset-x-0 top-20 -z-10 h-72 bg-[radial-gradient(circle_at_50%_0%,rgba(88,164,255,0.13),transparent_68%)]" />

      <div className="mx-auto max-w-7xl">
        <div className="max-w-5xl" data-reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">{content.eyebrow}</p>
          <h2 className="mt-5 max-w-5xl font-serif text-[clamp(2.6rem,4.9vw,4.7rem)] font-semibold leading-[0.94] tracking-[-0.055em] text-primary">
            {content.headlinePrefix} <br />
            <span className="text-accent">{content.headlineAccent}</span> {content.headlineSuffix}
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted sm:text-xl sm:leading-9">
            {content.subheadline}
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {content.items.map((pillar, index) => (
            <article
              key={index}
              className="group overflow-hidden border border-white/14 bg-white/2.5 transition-colors duration-300 hover:border-accent/45 hover:bg-white/4.5"
              data-reveal
            >
              <figure className="relative m-2 flex h-64 items-center justify-center overflow-hidden border border-white/10 bg-black/18 p-3 sm:m-3 sm:h-72 lg:h-76">
                <div className="absolute inset-3 transition-transform duration-500 group-hover:scale-[1.02]">
                  <img
                    src={benefitImages[index][0]}
                    alt=""
                    className="absolute inset-0 h-full w-full animate-[benefit-slide-primary_6s_ease-in-out_infinite] object-cover"
                    loading="lazy"
                  />
                  <img
                    src={benefitImages[index][1]}
                    alt=""
                    className="absolute inset-0 h-full w-full animate-[benefit-slide-secondary_6s_ease-in-out_infinite] object-cover"
                    loading="lazy"
                  />
                </div>
              </figure>

              <div className="border-t border-white/10 p-5 sm:p-6">
                <span className="mb-5 flex h-10 w-10 items-center justify-center border border-accent/40 bg-page/70 text-xs font-semibold tracking-[0.22em] text-accent">
                  0{index + 1}
                </span>
                <h3 className="font-serif text-2xl font-semibold leading-[1.05] tracking-[-0.04em] text-primary sm:text-3xl">
                  {pillar.title}
                </h3>
                <p className="mt-5 text-base leading-7 text-muted">{pillar.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
