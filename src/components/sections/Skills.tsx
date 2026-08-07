'use client';

import { useTranslations } from 'next-intl';
import { useReveal } from '@/animation/useReveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SkillBar } from '@/components/ui/SkillBar';
import { SKILL_GROUPS, TECH_TAGS } from '@/content/cv';

export function Skills() {
  const t = useTranslations('skills');
  const scope = useReveal<HTMLDivElement>({ stagger: 0.07 });

  return (
    <section id="skills" aria-labelledby="skills-heading" className="py-20 md:py-28 xl:py-36">
      <div className="container-page" ref={scope}>
        <SectionHeading kicker={t('kicker')} title={t('title')} headingId="skills-heading" />

        <div className="grid gap-x-14 gap-y-8 lg:grid-cols-2 xl:gap-x-20">
          {SKILL_GROUPS.map((skill) => (
            <SkillBar
              key={skill.id}
              label={skill.label}
              level={skill.level}
              ariaLabel={t('levelLabel', { label: skill.label, level: skill.level })}
            />
          ))}
        </div>

        <p
          data-reveal-child
          className="mt-10 max-w-[68ch] text-fluid-sm leading-relaxed text-ink-muted md:mt-12"
        >
          {t('aiNote')}
        </p>

        {/* Secondary toolbox */}
        <div className="mt-16 md:mt-20">
          <h3
            data-reveal-child
            className="mb-5 text-fluid-xs tracking-[0.2em] text-ink-faint uppercase"
          >
            {t('alsoTitle')}
          </h3>

          <ul className="flex flex-wrap gap-2">
            {TECH_TAGS.map((tag) => (
              <li
                key={tag}
                data-reveal-child
                className="rounded-lg border border-hairline bg-surface/50 px-3 py-1.5 text-xs text-ink-muted transition-colors duration-300 hover:border-gold/50 hover:text-gold-bright md:text-sm"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
