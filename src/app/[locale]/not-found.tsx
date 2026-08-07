import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function NotFound() {
  const t = useTranslations('notFound');

  return (
    <main className="container-page flex min-h-dvh flex-col items-center justify-center py-24 text-center">
      <p className="mb-4 text-fluid-xs font-semibold tracking-[0.22em] text-gold uppercase">404</p>
      <h1 className="text-fluid-3xl font-semibold tracking-tight">{t('title')}</h1>
      <p className="mt-4 max-w-[40ch] text-fluid-base text-ink-muted">{t('description')}</p>

      <Link
        href="/"
        className="mt-10 inline-flex items-center rounded-full bg-gold px-6 py-3 font-semibold text-canvas transition-colors hover:bg-gold-bright"
      >
        {t('back')}
      </Link>
    </main>
  );
}
