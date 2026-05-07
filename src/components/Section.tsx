import type { ComponentPropsWithoutRef, ReactNode } from 'react';

type SectionProps = ComponentPropsWithoutRef<'section'> & {
  eyebrow?: string;
  title?: string;
  intro?: string;
  children: ReactNode;
};

export function Section({ eyebrow, title, intro, children, className = '', ...props }: SectionProps) {
  return (
    <section className={`px-5 py-16 sm:px-8 sm:py-20 lg:px-12 ${className}`} {...props}>
      <div className="mx-auto max-w-6xl">
        {(eyebrow || title || intro) && (
          <div className="mb-10 max-w-3xl">
            {eyebrow && <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-accent">{eyebrow}</p>}
            {title && <h2 className="font-serif text-3xl font-semibold tracking-[-0.03em] text-primary sm:text-4xl lg:text-5xl">{title}</h2>}
            {intro && <p className="mt-5 max-w-2xl text-base leading-8 text-muted sm:text-lg">{intro}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
