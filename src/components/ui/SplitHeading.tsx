'use client';

import type { ElementType, ReactNode } from 'react';
import { useSplitReveal } from '@/animation/useSplitReveal';
import { cn } from '@/lib/cn';

type SplitHeadingProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Animate on mount rather than on scroll — used for the hero. */
  immediate?: boolean;
  delay?: number;
  stagger?: number;
  id?: string;
};

/**
 * Heading whose characters slide up from behind a clipped edge.
 *
 * `data-reveal` keeps it hidden until the split has been prepared, which avoids
 * a frame of un-split text at the wrong opacity.
 */
export function SplitHeading({
  children,
  as: Tag = 'h2',
  className,
  immediate = false,
  delay = 0,
  stagger,
  id,
}: SplitHeadingProps) {
  const ref = useSplitReveal<HTMLHeadingElement>({ immediate, delay, stagger });

  return (
    <Tag ref={ref} id={id} data-reveal className={cn(className)}>
      {children}
    </Tag>
  );
}
