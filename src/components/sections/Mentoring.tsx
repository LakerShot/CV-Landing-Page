'use client';

import { useTranslations } from 'next-intl';
import { useReveal } from '@/animation/useReveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Timeline, TimelineItem } from '@/components/ui/TimelineItem';
import { MENTORING } from '@/content/cv';

export function Mentoring() {
  const t = useTranslations('mentoring');
  const scope = useReveal<HTMLDivElement>();

  return (
    <section id="mentoring" aria-labelledby="mentoring-heading" className="py-20 md:py-28 xl:py-36">
      <div className="container-page" ref={scope}>
        <SectionHeading kicker={t('kicker')} title={t('title')} headingId="mentoring-heading" />

        <Timeline className="xl:pr-16">
          {MENTORING.map((item) => (
            <TimelineItem
              key={item.id}
              title={item.company}
              titleHref={item.website}
              subtitle={t(`items.${item.id}.role`)}
              location={t(`items.${item.id}.location`)}
              meta={`${t(`items.${item.id}.arrangement`)} · ${t(`items.${item.id}.duration`)}`}
              description={t(`items.${item.id}.description`)}
              tags={item.tags}
              media={item.media}
            />
          ))}
        </Timeline>
      </div>
    </section>
  );
}
