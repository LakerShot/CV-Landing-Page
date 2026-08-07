'use client';

import { useTranslations } from 'next-intl';
import { useReveal } from '@/animation/useReveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Timeline, TimelineItem } from '@/components/ui/TimelineItem';
import { EDUCATION } from '@/content/cv';

export function Education() {
  const t = useTranslations('education');
  const scope = useReveal<HTMLDivElement>();

  return (
    <section id="education" aria-labelledby="education-heading" className="py-20 md:py-28 xl:py-36">
      <div className="container-page" ref={scope}>
        <SectionHeading kicker={t('kicker')} title={t('title')} headingId="education-heading" />

        <Timeline className="xl:pr-16">
          {EDUCATION.map((item) => {
            const note = t(`items.${item.id}.note`);
            const period = t(`items.${item.id}.period`);

            return (
              <TimelineItem
                key={item.id}
                title={item.institution}
                location={t(`items.${item.id}.location`)}
                // `note` is empty for schools without an attendance qualifier.
                meta={note ? `${period} · ${note}` : period}
                description={t(`items.${item.id}.description`)}
              />
            );
          })}
        </Timeline>
      </div>
    </section>
  );
}
