import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Manrope, Outfit } from 'next/font/google';
import { routing, type Locale } from '@/i18n/routing';
import { PROFILE } from '@/content/cv';
import { SITE_URL } from '@/lib/site';
import '../globals.css';

/*
 * Gilroy is a commercial typeface and is not available on Google Fonts. Outfit
 * is the closest free geometric substitute for display use, paired with Manrope
 * for body copy, which holds up better at small sizes.
 */
const outfit = Outfit({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-outfit',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const manrope = Manrope({
  // latin-ext / cyrillic are needed for the Russian locale.
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  variable: '--font-manrope',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    metadataBase: new URL(SITE_URL),
    title: t('title'),
    description: t('description'),
    applicationName: `${PROFILE.firstName} ${PROFILE.lastName} — CV`,
    authors: [{ name: `${PROFILE.firstName} ${PROFILE.lastName}` }],
    creator: `${PROFILE.firstName} ${PROFILE.lastName}`,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: '/en',
        ru: '/ru',
        // Tells crawlers which version to serve when no language matches.
        'x-default': '/en',
      },
    },
    openGraph: {
      type: 'profile',
      locale: locale === 'ru' ? 'ru_RU' : 'en_US',
      url: `/${locale}`,
      title: t('title'),
      description: t('description'),
      siteName: `${PROFILE.firstName} ${PROFILE.lastName}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Required for static rendering of this locale's page.
  setRequestLocale(locale as Locale);

  return (
    /*
     * `js` is rendered server-side rather than added by an inline script.
     * Mutating the <html> class before hydration is what the usual "avoid a
     * flash of unstyled content" trick does, but here it made the server and
     * client markup disagree and React bailed out of hydrating the whole tree.
     * Shipping the class in the HTML costs nothing and the <noscript> block
     * below restores the no-JavaScript fallback.
     */
    <html lang={locale} className={`js ${outfit.variable} ${manrope.variable}`}>
      <body>
        <noscript>
          <style>{`[data-reveal],[data-reveal-child],[data-hero-fade],[data-hero-portrait]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
