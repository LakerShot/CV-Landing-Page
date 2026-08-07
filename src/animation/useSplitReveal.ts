'use client';

import { useRef } from 'react';
import { SplitText, gsap, prefersReducedMotion, useGSAP } from './gsap';

type SplitRevealOptions = {
  /** Delay before the reveal starts, in seconds. */
  delay?: number;
  /** Animate on mount (hero) instead of on scroll (section headings). */
  immediate?: boolean;
  stagger?: number;
};

/**
 * Reveals a heading by sliding its characters up from behind a clipped edge.
 *
 * The element must carry the `split-mask` utility (or `overflow: hidden`) on the
 * line wrapper, otherwise the characters are visible while still below the
 * baseline. Splitting is reverted on cleanup so the original DOM — and the text
 * that screen readers and crawlers see — is restored.
 */
export function useSplitReveal<T extends HTMLElement = HTMLHeadingElement>({
  delay = 0,
  immediate = false,
  stagger = 0.028,
}: SplitRevealOptions = {}) {
  const ref = useRef<T>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (prefersReducedMotion()) {
        gsap.set(el, { opacity: 1 });
        return;
      }

      let split: SplitText | undefined;
      let tween: gsap.core.Tween | undefined;
      let cancelled = false;

      const run = () => {
        if (cancelled || !ref.current) return;

        split = SplitText.create(el, {
          /*
           * `words` is not optional here. Without it the characters become
           * direct children of the line and the browser is free to break
           * between any two of them.
           */
          type: 'lines,words,chars',
          linesClass: 'split-mask',
          // Prevents screen readers reading the text character by character.
          aria: 'auto',
        });

        gsap.set(el, { opacity: 1 });

        tween = gsap.from(split.chars, {
          yPercent: 115,
          duration: 0.9,
          ease: 'power4.out',
          stagger,
          delay,
          scrollTrigger: immediate
            ? undefined
            : {
                trigger: el,
                start: 'top 85%',
                once: true,
              },
        });
      };

      /*
       * Wait for webfonts before splitting. SplitText derives lines from the
       * measured position of each character, so splitting while the fallback
       * font is still in use bakes the *fallback's* line breaks into the DOM —
       * which is how "MOROZOV" ended up rendered as "MOR" / "OZOV".
       */
      if (document.fonts && document.fonts.status !== 'loaded') {
        void document.fonts.ready.then(run);
      } else {
        run();
      }

      return () => {
        cancelled = true;
        tween?.kill();
        split?.revert();
      };
    },
    { dependencies: [delay, immediate, stagger] },
  );

  return ref;
}
