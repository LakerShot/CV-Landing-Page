'use client';

import { useRef } from 'react';
import { gsap, prefersReducedMotion, useGSAP } from './gsap';

/**
 * Counts a number up from zero when the element scrolls into view.
 *
 * The element should be server-rendered with the final value as its text so the
 * page is correct before hydration and for crawlers; this only animates the way
 * it gets there.
 */
export function useCounter<T extends HTMLElement = HTMLSpanElement>(
  value: number,
  { duration = 1.4, suffix = '' }: { duration?: number; suffix?: string } = {},
) {
  const ref = useRef<T>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (prefersReducedMotion()) {
        el.textContent = `${value}${suffix}`;
        return;
      }

      const state = { current: 0 };

      gsap.to(state, {
        current: value,
        duration,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = `${Math.round(state.current)}${suffix}`;
        },
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          once: true,
        },
      });
    },
    { dependencies: [value, duration, suffix] },
  );

  return ref;
}
