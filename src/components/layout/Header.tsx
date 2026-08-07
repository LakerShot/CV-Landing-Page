'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Download, Menu, X } from 'lucide-react';
import { ScrollTrigger, gsap, prefersReducedMotion, useGSAP } from '@/animation/gsap';
import { scrollToId, scrollToTop, setScrollLocked } from '@/animation/lenis-instance';
import { LocaleSwitcher } from './LocaleSwitcher';
import { PROFILE, SECTIONS, type SectionId } from '@/content/cv';
import { cn } from '@/lib/cn';

export function Header() {
  const tNav = useTranslations('nav');
  const tHero = useTranslations('hero');

  const [active, setActive] = useState<SectionId | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [condensed, setCondensed] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  /* Track which section is in view, and whether the header should condense. */
  useGSAP(() => {
    const triggers = SECTIONS.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;

      return ScrollTrigger.create({
        trigger: el,
        start: 'top 40%',
        end: 'bottom 40%',
        onToggle: (self) => {
          if (self.isActive) setActive(id);
        },
      });
    }).filter((trigger): trigger is ScrollTrigger => trigger !== null);

    // Only toggles at the 100px threshold — no per-frame state updates.
    const condense = ScrollTrigger.create({
      start: 100,
      end: 'max',
      onToggle: (self) => setCondensed(self.isActive),
    });

    return () => {
      triggers.forEach((trigger) => trigger.kill());
      condense.kill();
    };
  });

  /* Animate the mobile menu in and lock scrolling while it is open. */
  useGSAP(
    () => {
      const el = menuRef.current;
      if (!el) return;

      setScrollLocked(true);

      if (prefersReducedMotion()) return;

      gsap
        .timeline()
        .fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, ease: 'power2.out' })
        .fromTo(
          el.querySelectorAll('[data-menu-item]'),
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power3.out' },
          0.06,
        );
    },
    { dependencies: [menuOpen] },
  );

  /* Close on Escape; always release the scroll lock on unmount. */
  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      setScrollLocked(false);
    };
  }, [menuOpen]);

  const goTo = (id: SectionId) => {
    setMenuOpen(false);
    scrollToId(id);
  };

  return (
    <>
      <a
        href="#main"
        className="sr-only rounded-full bg-gold px-4 py-2 font-semibold text-canvas focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-60"
      >
        {tNav('skipToContent')}
      </a>

      <header
        data-print-hidden
        className={cn(
          'fixed inset-x-0 top-0 z-40 transition-all duration-500',
          condensed
            ? 'border-b border-hairline bg-canvas/80 backdrop-blur-xl'
            : 'border-b border-transparent',
        )}
      >
        <div className="container-page flex h-16 items-center justify-between gap-4 md:h-20">
          <button
            type="button"
            onClick={scrollToTop}
            className="cursor-pointer font-display text-lg font-bold tracking-[-0.04em] text-gold transition-colors hover:text-gold-bright"
            aria-label={`${PROFILE.firstName} ${PROFILE.lastName}`}
          >
            EM
          </button>

          <nav aria-label={tNav('primaryLabel')} className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {SECTIONS.map((id) => (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => goTo(id)}
                    aria-current={active === id ? 'true' : undefined}
                    className={cn(
                      'relative cursor-pointer rounded-full px-3.5 py-2 text-sm transition-colors duration-300',
                      active === id ? 'text-gold' : 'text-ink-muted hover:text-ink',
                    )}
                  >
                    {tNav(id)}
                    {active === id && (
                      <span
                        className="absolute inset-x-3.5 -bottom-0.5 h-px bg-gold"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <LocaleSwitcher />

            <a
              href={PROFILE.cvFile}
              download
              className="hidden items-center gap-2 rounded-full border border-hairline px-4 py-2 text-sm text-ink transition-colors duration-300 hover:border-gold hover:text-gold-bright md:inline-flex"
            >
              <Download className="size-4" aria-hidden="true" />
              {tHero('downloadCv')}
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={tNav('openMenu')}
              aria-expanded={menuOpen}
              className="cursor-pointer rounded-full border border-hairline p-2 text-ink transition-colors hover:border-gold lg:hidden"
            >
              <Menu className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div
          ref={menuRef}
          data-mobile-menu
          data-print-hidden
          className="fixed inset-0 z-50 flex flex-col bg-canvas/95 p-6 backdrop-blur-xl lg:hidden"
        >
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label={tNav('closeMenu')}
              className="cursor-pointer rounded-full border border-hairline p-2 text-ink transition-colors hover:border-gold"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>

          <nav aria-label={tNav('primaryLabel')} className="flex flex-1 items-center">
            <ul className="w-full space-y-1">
              {SECTIONS.map((id) => (
                <li key={id} data-menu-item>
                  <button
                    type="button"
                    onClick={() => goTo(id)}
                    className="w-full cursor-pointer py-1 text-left font-display text-fluid-2xl font-semibold tracking-tight transition-colors hover:text-gold"
                  >
                    {tNav(id)}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <a
            data-menu-item
            href={PROFILE.cvFile}
            download
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 font-semibold text-canvas"
          >
            <Download className="size-4" aria-hidden="true" />
            {tHero('downloadCv')}
          </a>
        </div>
      )}
    </>
  );
}
