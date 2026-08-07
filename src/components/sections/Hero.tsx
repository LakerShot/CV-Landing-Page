'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowDown, Cake, Mail } from 'lucide-react';
import { gsap, prefersReducedMotion, useGSAP } from '@/animation/gsap';
import { scrollToId } from '@/animation/lenis-instance';
import { SplitHeading } from '@/components/ui/SplitHeading';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { BrandIcon } from '@/components/ui/BrandIcon';
import { COUNTRIES, EXPERIENCE, PROFILE, SOCIALS } from '@/content/cv';

export function Hero() {
  const t = useTranslations('hero');
  const tA11y = useTranslations('a11y');
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set('[data-hero-fade], [data-hero-portrait]', { opacity: 1, y: 0 });
        return;
      }

      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

      timeline
        .fromTo(
          '[data-hero-portrait]',
          { opacity: 0, scale: 1.06, yPercent: 4 },
          { opacity: 1, scale: 1, yPercent: 0, duration: 1.4, ease: 'power2.out' },
          0.15,
        )
        .fromTo(
          '[data-hero-fade]',
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.09 },
          0.5,
        );

      // Portrait drifts slower than the page for depth.
      gsap.to('[data-hero-portrait]', {
        yPercent: -9,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    },
    { scope: root },
  );

  // Literal message keys keep this safe if strict next-intl typing is added later.
  const stats = [
    { key: 'years', value: PROFILE.yearsOfExperience, label: t('stats.years') },
    { key: 'companies', value: EXPERIENCE.length, label: t('stats.companies') },
    { key: 'countries', value: COUNTRIES.length, label: t('stats.countries') },
  ];

  return (
    <section
      ref={root}
      id="about"
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24 xl:pt-44 xl:pb-32"
    >
      {/* Ambient gold wash behind the hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(60% 55% at 78% 22%, rgba(201,162,39,0.16) 0%, rgba(201,162,39,0) 70%)',
        }}
      />

      <div className="container-page">
        <div className="grid items-center gap-12 md:gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10 xl:gap-16">
          {/* --- Copy --- */}
          <div className="order-2 lg:order-1">
            <p
              data-hero-fade
              className="mb-5 flex items-center gap-3 text-fluid-xs font-semibold tracking-[0.22em] text-gold uppercase"
            >
              <span className="h-px w-8 shrink-0 bg-gold" aria-hidden="true" />
              {t('role')}
            </p>

            <SplitHeading
              as="h1"
              id="hero-heading"
              immediate
              delay={0.15}
              stagger={0.024}
              className="text-fluid-hero font-extrabold tracking-[-0.045em] uppercase"
            >
              {/*
                Two explicit lines rather than one string left to wrap: at hero
                sizes the surname is close to the column width, and forcing the
                break here means no viewport can split it mid-word.
              */}
              <span className="block">{PROFILE.firstName}</span>
              {/* Keeps the accessible name "Egor Morozov" rather than "EgorMorozov". */}{' '}
              <span className="block">{PROFILE.lastName}</span>
            </SplitHeading>

            <p
              data-hero-fade
              className="mt-6 max-w-[46ch] text-fluid-base leading-relaxed text-ink-muted md:mt-8"
            >
              {t.rich('summary', {
                years: PROFILE.yearsOfExperience,
                b: (chunks) => <strong className="font-semibold text-ink">{chunks}</strong>,
              })}
            </p>

            {/* CTAs */}
            <div data-hero-fade className="mt-8 flex flex-wrap items-center gap-3 md:mt-10">
              <MagneticButton href={PROFILE.cvFile} download>
                {t('downloadCv')}
              </MagneticButton>
              <MagneticButton href={`mailto:${PROFILE.email}`} variant="ghost">
                <Mail className="size-4" aria-hidden="true" />
                {t('getInTouch')}
              </MagneticButton>
            </div>

            {/* Quick facts */}
            <dl
              data-hero-fade
              className="mt-10 grid gap-x-8 gap-y-5 border-t border-hairline pt-8 sm:grid-cols-2 md:mt-12"
            >
              <div>
                <dt className="mb-1 flex items-center gap-1.5 text-fluid-xs tracking-[0.14em] text-ink-faint uppercase">
                  <Cake className="size-3.5" aria-hidden="true" />
                  {t('dobLabel')}
                </dt>
                <dd className="text-fluid-sm">
                  <time dateTime={PROFILE.dateOfBirth}>{PROFILE.dateOfBirthDisplay}</time>
                </dd>
              </div>

              <div>
                <dt className="mb-1 flex items-center gap-1.5 text-fluid-xs tracking-[0.14em] text-ink-faint uppercase">
                  <Mail className="size-3.5" aria-hidden="true" />
                  {t('emailLabel')}
                </dt>
                <dd className="text-fluid-sm">
                  <a
                    href={`mailto:${PROFILE.email}`}
                    className="break-all underline decoration-gold/40 underline-offset-4 transition-colors hover:text-gold"
                  >
                    {PROFILE.email}
                  </a>
                </dd>
              </div>

              <div className="sm:col-span-2">
                <dt className="mb-2 text-fluid-xs tracking-[0.14em] text-ink-faint uppercase">
                  {t('linksLabel')}
                </dt>
                <dd className="flex flex-wrap items-center gap-2">
                  {SOCIALS.map((social) => (
                    <a
                      key={social.id}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-hairline px-3.5 py-1.5 text-xs text-ink-muted transition-colors duration-300 hover:border-gold hover:text-gold-bright"
                    >
                      <BrandIcon id={social.id} className="size-3.5" />
                      {social.label}
                    </a>
                  ))}
                </dd>
              </div>
            </dl>
          </div>

          {/* --- Portrait --- */}
          <div className="order-1 lg:order-2">
            <div className="relative mx-auto w-full max-w-[17rem] sm:max-w-[20rem] lg:max-w-none xl:max-w-[26rem]">
              {/* Arch frame sitting behind the cut-out */}
              <div
                aria-hidden="true"
                className="absolute inset-x-[6%] top-[14%] bottom-[4%] rounded-t-full rounded-b-[2.5rem] border border-gold/25 bg-gradient-to-b from-gold/12 via-surface/50 to-transparent"
              />
              <div
                aria-hidden="true"
                className="absolute inset-x-[18%] top-[26%] h-[46%] rounded-full bg-gold/10 blur-3xl"
              />

              {/*
                The mask PNG and the JPEG are both 809x1080 and are rendered into
                the same box at 100% x 100%, so the silhouette lines up exactly —
                no object-fit/mask-size mismatch to reconcile.
              */}
              <Image
                data-hero-portrait
                src={PROFILE.avatar}
                alt={tA11y('portraitAlt')}
                width={809}
                height={1080}
                priority
                sizes="(max-width: 1024px) 20rem, 26rem"
                className="relative h-auto w-full"
                style={{
                  /*
                   * Two mask layers intersected: the silhouette, plus a bottom
                   * fade. The silhouette runs to the bottom edge of the source
                   * frame, so on its own it ends in a hard horizontal cut across
                   * the shoulders.
                   */
                  maskImage: `url(${PROFILE.avatarMask}), linear-gradient(to bottom, #000 72%, transparent 97%)`,
                  WebkitMaskImage: `url(${PROFILE.avatarMask}), linear-gradient(to bottom, #000 72%, transparent 97%)`,
                  maskSize: '100% 100%, 100% 100%',
                  WebkitMaskSize: '100% 100%, 100% 100%',
                  maskRepeat: 'no-repeat, no-repeat',
                  WebkitMaskRepeat: 'no-repeat, no-repeat',
                  maskComposite: 'intersect',
                  WebkitMaskComposite: 'source-in',
                }}
              />
            </div>
          </div>
        </div>

        {/* --- Stats --- */}
        <dl
          data-hero-fade
          className="mt-14 grid grid-cols-3 gap-4 border-t border-hairline pt-8 md:mt-20 md:gap-8"
        >
          {stats.map((stat) => (
            <div key={stat.key}>
              <dd className="font-display text-fluid-2xl font-bold text-gold tabular-nums">
                {stat.value}
              </dd>
              <dt className="mt-1 text-fluid-xs leading-tight tracking-[0.1em] text-ink-faint uppercase">
                {stat.label}
              </dt>
            </div>
          ))}
        </dl>

        {/* Scroll hint */}
        <button
          type="button"
          data-hero-fade
          data-print-hidden
          onClick={() => scrollToId('skills')}
          className="mt-12 inline-flex cursor-pointer items-center gap-2 text-xs tracking-[0.2em] text-ink-faint uppercase transition-colors hover:text-gold"
        >
          <ArrowDown className="size-4 animate-bounce" aria-hidden="true" />
          {t('scrollHint')}
        </button>
      </div>
    </section>
  );
}
