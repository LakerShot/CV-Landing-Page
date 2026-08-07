'use client';

import { useRef } from 'react';
import { ScrollTrigger, gsap, prefersReducedMotion, useGSAP } from './gsap';

type RevealOptions = {
  /** Selector for staggered children; defaults to `[data-reveal-child]`. */
  childSelector?: string;
  /** Seconds between children. */
  stagger?: number;
  /**
   * Upper bound on the total stagger, in seconds. Long lists (the ~40 tech tags)
   * would otherwise take several seconds to finish appearing.
   */
  maxStagger?: number;
  /** Starting vertical offset in px. */
  y?: number;
  /** Where the trigger fires, in ScrollTrigger `start` syntax. */
  start?: string;
};

/**
 * Reveals a section's `[data-reveal-child]` elements as it scrolls into view.
 *
 * Returns a ref to attach to the section wrapper. The elements are expected to
 * be styled as hidden by `data-reveal-child` in CSS so there is no flash of
 * finished layout before hydration; `globals.css` forces them visible when
 * motion is reduced or the page is printed.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>({
  childSelector = '[data-reveal-child]',
  stagger = 0.09,
  maxStagger = 1.1,
  y = 34,
  start = 'top 78%',
}: RevealOptions = {}) {
  const scope = useRef<T>(null);

  useGSAP(
    () => {
      const targets = gsap.utils.toArray<HTMLElement>(childSelector, scope.current);
      if (!targets.length) return;

      if (prefersReducedMotion()) {
        gsap.set(targets, { opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          // `amount` distributes the whole stagger across the set, so a long
          // list stays snappy while a short one keeps the intended rhythm.
          stagger: { amount: Math.min(targets.length * stagger, maxStagger) },
          ease: 'power3.out',
          scrollTrigger: {
            trigger: scope.current,
            start,
            once: true,
          },
        },
      );
    },
    { scope, dependencies: [childSelector, stagger, maxStagger, y, start] },
  );

  return scope;
}

/** Re-export so sections can refresh triggers after layout-affecting changes. */
export { ScrollTrigger };
