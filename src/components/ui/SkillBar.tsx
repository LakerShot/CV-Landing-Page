'use client';

import { useRef } from 'react';
import { gsap, prefersReducedMotion, useGSAP } from '@/animation/gsap';

type SkillBarProps = {
  label: string;
  /** 0–100. */
  level: number;
  /** Localised description for assistive tech, e.g. "Vue 3: 92 out of 100". */
  ariaLabel: string;
};

/**
 * A labelled proficiency bar that fills, and counts up, when scrolled into view.
 *
 * The fill is animated with `scaleX` rather than `width` to keep it off the
 * layout thread. The numeric value is rendered server-side at its final figure,
 * so it is correct before hydration and in the reduced-motion path.
 */
export function SkillBar({ label, level, ariaLabel }: SkillBarProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const fill = root.current?.querySelector<HTMLElement>('[data-skill-fill]');
      const value = root.current?.querySelector<HTMLElement>('[data-skill-value]');
      if (!fill) return;

      if (prefersReducedMotion()) {
        gsap.set(fill, { scaleX: level / 100 });
        return;
      }

      const timeline = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: 'top 88%', once: true },
      });

      timeline.fromTo(
        fill,
        { scaleX: 0 },
        { scaleX: level / 100, duration: 1.1, ease: 'power3.out' },
      );

      if (value) {
        const state = { current: 0 };
        timeline.to(
          state,
          {
            current: level,
            duration: 1.1,
            ease: 'power3.out',
            onUpdate: () => {
              value.textContent = String(Math.round(state.current));
            },
          },
          0,
        );
      }
    },
    { dependencies: [level] },
  );

  return (
    <div ref={root} data-reveal-child>
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <span className="font-display text-fluid-sm font-medium tracking-tight md:text-fluid-base">
          {label}
        </span>
        <span className="font-mono text-xs text-gold tabular-nums" aria-hidden="true">
          <span data-skill-value>{level}</span>
        </span>
      </div>

      <div
        className="relative h-1.5 w-full overflow-hidden rounded-full bg-surface-2"
        role="meter"
        aria-valuenow={level}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={ariaLabel}
      >
        <div
          data-skill-fill
          className="absolute inset-0 origin-left rounded-full bg-gradient-to-r from-gold-deep via-gold to-gold-bright"
          style={{ transform: `scaleX(${level / 100})` }}
        />
      </div>
    </div>
  );
}
