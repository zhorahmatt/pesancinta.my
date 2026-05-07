import type { ComponentPropsWithoutRef } from 'react';
import { trackCtaClick } from '../lib/tracking';

type CtaButtonProps = ComponentPropsWithoutRef<'a'> & {
  location: string;
  targetName: string;
  variant?: 'primary' | 'secondary';
};

const variants = {
  primary:
    'bg-accent text-ink shadow-[0_18px_40px_rgb(243_198_81_/_0.2)] hover:bg-accent-deep hover:-translate-y-0.5',
  secondary:
    'border border-white/20 bg-white/5 text-primary hover:border-accent/70 hover:bg-white/10',
};

export function CtaButton({
  location,
  targetName,
  variant = 'primary',
  className = '',
  onClick,
  children,
  ...props
}: CtaButtonProps) {
  return (
    <a
      className={`inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-bold transition duration-200 focus-visible:outline-accent sm:px-6 ${variants[variant]} ${className}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => {
        trackCtaClick({ location, target: targetName });
        onClick?.(event);
      }}
      {...props}
    >
      {children}
    </a>
  );
}
