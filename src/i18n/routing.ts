import { defineRouting } from 'next-intl/routing';

export const locales = ['en', 'ru'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

/** Human labels for the locale switcher. */
export const localeNames: Record<Locale, string> = {
  en: 'EN',
  ru: 'RU',
};

export const routing = defineRouting({
  locales,
  defaultLocale,
  // Both languages get their own indexable URL, so never hide the prefix.
  localePrefix: 'always',
});
