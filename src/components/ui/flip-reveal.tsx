"use client";

import { type ComponentProps, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Flip from 'gsap/Flip';

gsap.registerPlugin(Flip);

type FlipRevealItemProps = {
  flipKey: string;
} & ComponentProps<'div'>;

export function FlipRevealItem({ flipKey, ...props }: FlipRevealItemProps) {
  return <div data-flip={flipKey} {...props} />;
}

type FlipRevealProps = {
  keys: string[];
  showClass?: string;
  hideClass?: string;
} & ComponentProps<'div'>;

export function FlipReveal({ keys, hideClass = '', showClass = '', ...props }: FlipRevealProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (!wrapperRef.current) return;

      const items = gsap.utils.toArray<HTMLDivElement>('[data-flip]', wrapperRef.current);
      const state = Flip.getState(items);
      const useAbsoluteLayout = window.matchMedia('(min-width: 640px)').matches;

      items.forEach((item) => {
        const key = item.dataset.flip;
        const shouldShow = Boolean(key && (keys.includes('all') || keys.includes(key)));

        item.classList.toggle(showClass, shouldShow);
        item.classList.toggle(hideClass, !shouldShow);
      });

      Flip.from(state, {
        absolute: useAbsoluteLayout,
        duration: 0.6,
        ease: 'power1.inOut',
        scale: true,
        stagger: 0.05,
        onEnter: (elements) => gsap.fromTo(elements, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.45 }),
        onLeave: (elements) => gsap.to(elements, { opacity: 0, scale: 0.96, duration: 0.35 }),
      });
    },
    { dependencies: [keys], scope: wrapperRef },
  );

  return <div {...props} ref={wrapperRef} />;
}
