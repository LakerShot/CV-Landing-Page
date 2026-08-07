import { ImageResponse } from 'next/og';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { PROFILE } from '@/content/cv';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = `${PROFILE.firstName} ${PROFILE.lastName} — Frontend Developer`;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * Link-preview card, generated per locale at build time.
 *
 * Deliberately built from primitives and system-weight text only: fetching a
 * webfont here would add a network dependency to the build for a 1200x630 image
 * that nobody reads closely.
 */
export default async function OpengraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#0B0B0D',
        padding: 80,
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(60% 60% at 85% 15%, rgba(201,162,39,0.28) 0%, rgba(201,162,39,0) 70%)',
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ width: 56, height: 4, background: '#C9A227' }} />
        <div
          style={{
            color: '#C9A227',
            fontSize: 28,
            letterSpacing: 6,
            textTransform: 'uppercase',
            fontWeight: 700,
          }}
        >
          {t('ogTagline')}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            color: '#F2F2F3',
            fontSize: 132,
            fontWeight: 800,
            letterSpacing: -6,
            lineHeight: 1,
            textTransform: 'uppercase',
          }}
        >
          {PROFILE.firstName}
        </div>
        <div
          style={{
            color: '#C9A227',
            fontSize: 132,
            fontWeight: 800,
            letterSpacing: -6,
            lineHeight: 1,
            textTransform: 'uppercase',
          }}
        >
          {PROFILE.lastName}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          color: '#9A9AA2',
          fontSize: 26,
        }}
      >
        <div>{PROFILE.email}</div>
        <div style={{ color: '#6A6A72' }}>github.com/LakerShot</div>
      </div>
    </div>,
    size,
  );
}
