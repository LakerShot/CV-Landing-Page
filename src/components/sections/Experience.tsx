'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { gsap, prefersReducedMotion, useGSAP } from '@/animation/gsap';
import { useReveal } from '@/animation/useReveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Timeline, TimelineItem } from '@/components/ui/TimelineItem';
import { EXPERIENCE } from '@/content/cv';

export function Experience() {
  const t = useTranslations('experience');
  const scope = useReveal<HTMLDivElement>({ stagger: 0.12 });
  const timelineRef = useRef<HTMLDivElement>(null);

  /* Draw the vertical gold line as the section scrolls past. */
  useGSAP(
    () => {
      const line = timelineRef.current?.querySelector<HTMLElement>('[data-timeline-line]');
      if (!line) return;

      if (prefersReducedMotion()) {
        gsap.set(line, { scaleY: 1 });
        return;
      }

      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: timelineRef.current,
            start: 'top 70%',
            end: 'bottom 70%',
            scrub: 0.6,
          },
        },
      );
    },
    { scope: timelineRef },
  );

  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="py-20 md:py-28 xl:py-36"
    >
      <div className="container-page" ref={scope}>
        <SectionHeading kicker={t('kicker')} title={t('title')} headingId="experience-heading" />

        <Timeline className="xl:pr-16" ref={timelineRef}>
          {EXPERIENCE.map((job) => (
            <TimelineItem
              key={job.id}
              title={job.company}
              titleHref={job.website}
              titleNote={job.websiteUnavailable ? t('companyUnavailable') : undefined}
              subtitle={t(`items.${job.id}.role`)}
              location={t(`items.${job.id}.location`)}
              meta={`${t(`items.${job.id}.arrangement`)} · ${t(`items.${job.id}.duration`)}`}
              description={t(`items.${job.id}.description`)}
              tags={job.tags}
              media={job.media}
              current={job.current}
            />
          ))}
        </Timeline>
      </div>
    </section>
  );
}
