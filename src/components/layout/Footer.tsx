'use client';

import { useTranslations } from 'next-intl';
import { ArrowUp } from 'lucide-react';
import { scrollToTop } from '@/animation/lenis-instance';
import { PROFILE } from '@/content/cv';

export function Footer() {
  const t = useTranslations('footer');
  const tContact = useTranslations('contact');

  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-hairline py-10 md:py-12">
      <div className="container-page flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="space-y-1 text-xs text-ink-faint md:text-sm">
          <p>
            © {year} {t('rights')}
          </p>
          <p>{t('builtWith')}</p>
        </div>

        <div className="flex items-center gap-4">
          <a
            href={`mailto:${PROFILE.email}`}
            className="text-xs text-ink-muted transition-colors hover:text-gold md:text-sm"
          >
            {PROFILE.email}
          </a>

          <button
            type="button"
            data-print-hidden
            onClick={scrollToTop}
            aria-label={tContact('backToTop')}
            className="cursor-pointer rounded-full border border-hairline p-2.5 text-ink-muted transition-colors hover:border-gold hover:text-gold"
          >
            <ArrowUp className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
}
