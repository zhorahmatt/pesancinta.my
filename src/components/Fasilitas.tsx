import type { WorkshopContent } from '../content/landing';

type FasilitasProps = {
  content: WorkshopContent['fasilitas'];
};

export function Fasilitas({ content }: FasilitasProps) {
  return (
    <section className="relative isolate overflow-hidden border-y border-white/10 bg-page-deep px-5 py-18 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
      <div className="absolute inset-x-0 top-20 -z-10 h-72 bg-[radial-gradient(circle_at_50%_0%,rgba(88,164,255,0.13),transparent_68%)]" />

      <div className="mx-auto max-w-7xl">
        <div className="max-w-4xl" data-reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">{content.eyebrow}</p>
          <h2 className="mt-5 font-serif text-[clamp(2.7rem,5.4vw,5.25rem)] font-semibold leading-[0.94] tracking-[-0.055em] text-primary sm:whitespace-nowrap">
            {content.headline}
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted sm:text-xl sm:leading-9">
            {content.subheadline}
          </p>
        </div>

        <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {content.items.map((item, index) => (
            <li
              key={index}
              className="group flex items-center gap-4 border border-white/14 bg-page/2.5 p-4 transition-colors duration-300 hover:border-accent/45 hover:bg-page/4.5 sm:p-5"
              data-reveal
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-accent/40 bg-page/70 text-xs font-semibold tracking-[0.22em] text-accent">
                0{index + 1}
              </span>
              <div className="min-w-0">
                <h3 className="font-serif text-lg font-semibold leading-[1.1] tracking-[-0.04em] text-primary sm:text-xl">
                  {item.title}
                </h3>
                {item.text ? <p className="mt-1 text-sm leading-6 text-muted">{item.text}</p> : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
