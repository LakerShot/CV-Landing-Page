'use client';

import { useTranslations } from 'next-intl';
import { ArrowUpRight, Download, Mail } from 'lucide-react';
import { useReveal } from '@/animation/useReveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { BrandIcon } from '@/components/ui/BrandIcon';
import { PROFILE, SOCIALS } from '@/content/cv';

export function Contact() {
  const t = useTranslations('contact');
  const scope = useReveal<HTMLDivElement>({ stagger: 0.1 });

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative isolate overflow-hidden py-20 md:py-28 xl:py-36"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(55% 60% at 50% 100%, rgba(201,162,39,0.14) 0%, rgba(201,162,39,0) 70%)',
        }}
      />

      <div className="container-page" ref={scope}>
        <SectionHeading kicker={t('kicker')} title={t('title')} headingId="contact-heading" />

        <p data-reveal-child className="max-w-[52ch] text-fluid-lg leading-relaxed text-ink-muted">
          {t('lead')}
        </p>

        <div data-reveal-child className="mt-10 flex flex-wrap items-center gap-3">
          <MagneticButton href={`mailto:${PROFILE.email}`}>
            <Mail className="size-4" aria-hidden="true" />
            {t('emailCta')}
          </MagneticButton>
          <MagneticButton href={PROFILE.cvFile} download variant="ghost">
            <Download className="size-4" aria-hidden="true" />
            {t('downloadCta')}
          </MagneticButton>
        </div>

        {/* Big email link */}
        <a
          data-reveal-child
          href={`mailto:${PROFILE.email}`}
          className="group mt-14 inline-flex max-w-full items-center gap-3 font-display text-fluid-xl font-semibold tracking-tight text-ink transition-colors hover:text-gold md:mt-20"
        >
          <span className="break-all">{PROFILE.email}</span>
          <ArrowUpRight
            className="size-[1em] shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            aria-hidden="true"
          />
        </a>

        {/* Socials */}
        <div className="mt-14 md:mt-20">
          <h3
            data-reveal-child
            className="mb-5 text-fluid-xs tracking-[0.2em] text-ink-faint uppercase"
          >
            {t('socialsTitle')}
          </h3>

          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {SOCIALS.map((social) => (
              <li key={social.id} data-reveal-child>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-3 card-surface px-5 py-4 transition-colors duration-300 hover:border-gold/50"
                >
                  <span className="flex items-center gap-3">
                    <BrandIcon id={social.id} className="size-5 shrink-0 text-gold" />
                    <span className="text-fluid-sm">{social.label}</span>
                  </span>
                  <ArrowUpRight
                    className="size-4 shrink-0 text-ink-faint transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-gold"
                    aria-hidden="true"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
