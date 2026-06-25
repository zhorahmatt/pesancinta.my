"use client";

import React from 'react';
import { motion } from 'framer-motion';

export type Testimonial = {
  text: string;
  image: string;
  name: string;
  role: string;
};

type TestimonialsColumnProps = {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
};

export function TestimonialsColumn({ className, testimonials, duration = 16 }: TestimonialsColumnProps) {
  return (
    <div className={className}>
      <motion.div
        animate={{
          translateY: '-50%',
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'linear',
          repeatType: 'loop',
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {new Array(2).fill(0).map((_, index) => (
          <React.Fragment key={index}>
            {testimonials.map(({ text, image, name, role }) => (
              <article
                className="w-full max-w-xs rounded-3xl border border-white/12 bg-white/[0.06] p-7 text-primary shadow-[0_24px_80px_rgb(0_0_0_/_0.18)] backdrop-blur"
                key={`${name}-${role}`}
              >
                <p className="text-sm leading-7 text-muted">“{text}”</p>
                <div className="mt-6 flex items-center gap-3">
                  <img
                    width={44}
                    height={44}
                    src={image}
                    alt={name}
                    className="h-11 w-11 rounded-full border border-white/15 object-cover"
                    loading="lazy"
                  />
                  <div className="flex flex-col">
                    <div className="font-semibold leading-5 tracking-tight text-primary">{name}</div>
                    <div className="text-sm leading-5 tracking-tight text-muted">{role}</div>
                  </div>
                </div>
              </article>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
}
