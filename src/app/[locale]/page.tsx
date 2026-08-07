import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SmoothScrollProvider } from '@/animation/SmoothScrollProvider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { Hero } from '@/components/sections/Hero';
import { Skills } from '@/components/sections/Skills';
import { Experience } from '@/components/sections/Experience';
import { Mentoring } from '@/components/sections/Mentoring';
import { Education } from '@/components/sections/Education';
import { Contact } from '@/components/sections/Contact';
import { PersonJsonLd } from '@/components/PersonJsonLd';
import type { Locale } from '@/i18n/routing';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations({ locale, namespace: 'a11y' });

  return (
    <>
      <PersonJsonLd locale={locale} />
      <SmoothScrollProvider />
      <ScrollProgress label={t('scrollProgress')} />
      <Header />

      <main id="main">
        <Hero />
        <Skills />
        <Experience />
        <Mentoring />
        <Education />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
