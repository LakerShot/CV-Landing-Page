'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { ScrollTrigger, gsap, prefersReducedMotion } from './gsap';
import { setLenis } from './lenis-instance';

/**
 * Drives page scrolling with Lenis and keeps ScrollTrigger in sync.
 *
 * Lenis animates `window.scrollY` itself, so ScrollTrigger needs no
 * `scrollerProxy` — it only needs to be told to update on every Lenis frame,
 * and Lenis needs to be advanced by GSAP's ticker so the two never disagree
 * about the current time.
 *
 * When the visitor prefers reduced motion this mounts nothing at all: native
 * scrolling stays in charge.
 */
export function SmoothScrollProvider() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.05,
      // Gentle exponential ease-out; keeps long pages from feeling floaty.
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Native momentum on touch devices beats an emulated one.
      syncTouch: false,
    });

    setLenis(lenis);
    lenis.on('scroll', ScrollTrigger.update);

    const advance = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(advance);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(advance);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
