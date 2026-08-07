'use client';

import { useRef, type ReactNode } from 'react';
import { gsap, prefersReducedMotion, useGSAP } from '@/animation/gsap';
import { cn } from '@/lib/cn';

type MagneticButtonProps = {
  children: ReactNode;
  /** Renders an anchor when present, a button otherwise. */
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'ghost';
  external?: boolean;
  download?: boolean;
  className?: string;
  'aria-label'?: string;
};

const VARIANTS = {
  primary:
    'bg-gold text-canvas hover:bg-gold-bright border-transparent font-semibold shadow-[0_0_0_0_rgba(201,162,39,0.5)] hover:shadow-[0_8px_30px_-6px_rgba(201,162,39,0.6)]',
  ghost: 'border-hairline text-ink hover:border-gold hover:text-gold-bright bg-transparent',
} as const;

/**
 * Button that leans a few pixels toward the pointer while hovered.
 *
 * The transform is applied to an inner span so it never fights the element's own
 * layout, and the whole effect is skipped for reduced-motion visitors and on
 * touch devices, where there is no meaningful hover state.
 */
export function MagneticButton({
  children,
  href,
  onClick,
  variant = 'primary',
  external = false,
  download = false,
  className,
  'aria-label': ariaLabel,
}: MagneticButtonProps) {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const el = root.current;
    if (!el) return;
    if (prefersReducedMotion()) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const inner = el.querySelector<HTMLElement>('[data-magnetic-inner]');
    const moveTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
    const moveToY = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });
    const innerX = inner && gsap.quickTo(inner, 'x', { duration: 0.5, ease: 'power3.out' });
    const innerY = inner && gsap.quickTo(inner, 'y', { duration: 0.5, ease: 'power3.out' });

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      moveTo(dx * 0.16);
      moveToY(dy * 0.28);
      innerX?.(dx * 0.06);
      innerY?.(dy * 0.1);
    };

    const onLeave = () => {
      moveTo(0);
      moveToY(0);
      innerX?.(0);
      innerY?.(0);
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);

    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  });

  const classes = cn(
    'group relative inline-flex items-center justify-center gap-2 rounded-full border',
    'px-6 py-3 text-fluid-sm transition-colors duration-300 will-change-transform',
    VARIANTS[variant],
    className,
  );

  const content = (
    <span data-magnetic-inner className="inline-flex items-center gap-2">
      {children}
    </span>
  );

  if (href) {
    return (
      <a
        ref={root as React.RefObject<HTMLAnchorElement>}
        href={href}
        className={classes}
        aria-label={ariaLabel}
        {...(download ? { download: '' } : {})}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={root as React.RefObject<HTMLButtonElement>}
      type="button"
      onClick={onClick}
      className={classes}
      aria-label={ariaLabel}
    >
      {content}
    </button>
  );
}
