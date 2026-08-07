'use client';

import { useRef } from 'react';
import { gsap, prefersReducedMotion, useGSAP } from '@/animation/gsap';

/** Thin gold bar across the top of the viewport tracking reading progress. */
export function ScrollProgress({ label }: { label: string }) {
  const bar = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = bar.current;
    if (!el || prefersReducedMotion()) return;

    gsap.fromTo(
      el,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.3,
        },
      },
    );
  });

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5"
      data-print-hidden
      role="presentation"
      aria-label={label}
    >
      <div
        ref={bar}
        className="h-full origin-left scale-x-0 bg-gradient-to-r from-gold-deep via-gold to-gold-bright"
      />
    </div>
  );
}
