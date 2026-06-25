import { motion } from 'framer-motion';
import type { WorkshopContent } from '../content/landing';
import { TestimonialsColumn } from './ui/testimonials-columns-1';

type WorkshopTestimonialsProps = {
  content: WorkshopContent['testimonials'];
};

export function WorkshopTestimonials({ content }: WorkshopTestimonialsProps) {
  const firstColumn = content.items.slice(0, 3);
  const secondColumn = content.items.slice(3, 6);
  const thirdColumn = content.items.slice(6, 9);

  return (
    <section className="relative isolate overflow-hidden border-y border-white/10 bg-page px-5 py-18 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
      <div className="absolute right-[-8rem] top-16 -z-10 h-[28rem] w-[28rem] rounded-full bg-accent/10 blur-3xl" aria-hidden="true" />
      <div className="absolute left-[-10rem] bottom-10 -z-10 h-[30rem] w-[30rem] rounded-full bg-surface-soft/40 blur-3xl" aria-hidden="true" />

      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: '0px 0px -12% 0px' }}
          className="mx-auto flex max-w-3xl flex-col items-center text-center"
        >
          <div className="rounded-full border border-accent/35 bg-accent/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
            {content.eyebrow}
          </div>
          <h2 className="mt-5 font-serif text-[clamp(2.5rem,5vw,4.75rem)] font-semibold leading-[0.96] tracking-[-0.055em] text-primary">
            {content.headline}
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted sm:text-xl sm:leading-9">{content.subheadline}</p>
        </motion.div>

        <div className="mx-auto mt-12 flex max-h-[46rem] justify-center gap-6 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_16%,black_84%,transparent)]">
          <TestimonialsColumn testimonials={firstColumn} duration={17} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={21} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={19} />
        </div>
      </div>
    </section>
  );
}
