'use client';

/**
 * Single place where GSAP plugins are registered.
 *
 * Every animation module imports `gsap` from here rather than from the package
 * directly, which guarantees the plugins are registered exactly once and keeps
 * `registerPlugin` out of component files.
 *
 * ScrollTrigger and SplitText both ship in the public `gsap` package as of
 * v3.13 — no Club membership or private registry needed.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

  gsap.defaults({ ease: 'power3.out', duration: 0.9 });

  // Recalculate trigger positions once webfonts land, otherwise the initial
  // measurements are taken against fallback metrics and everything is offset.
  if ('fonts' in document) {
    void document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
}

/** True when the visitor asked the OS to minimise animation. */
export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
