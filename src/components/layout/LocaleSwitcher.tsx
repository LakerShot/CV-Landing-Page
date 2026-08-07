'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { locales, localeNames, type Locale } from '@/i18n/routing';
import { cn } from '@/lib/cn';

/**
 * RU/EN toggle.
 *
 * `usePathname` from next-intl returns the path *without* the locale prefix, so
 * pushing the same pathname under a different locale keeps the visitor on the
 * page they were reading.
 */
export function LocaleSwitcher({ className }: { className?: string }) {
  const t = useTranslations('a11y');
  const active = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border border-hairline bg-surface/60 p-0.5 backdrop-blur',
        className,
      )}
      role="group"
      aria-label={t('languageSwitcher')}
    >
      {locales.map((locale) => {
        const isActive = locale === active;

        return (
          <button
            key={locale}
            type="button"
            lang={locale}
            aria-current={isActive ? 'true' : undefined}
            aria-label={t('switchTo', { language: localeNames[locale] })}
            onClick={() => {
              if (!isActive) router.replace(pathname, { locale });
            }}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-semibold tracking-[0.08em] transition-colors duration-300',
              isActive ? 'bg-gold text-canvas' : 'cursor-pointer text-ink-muted hover:text-ink',
            )}
          >
            {localeNames[locale]}
          </button>
        );
      })}
    </div>
  );
}
