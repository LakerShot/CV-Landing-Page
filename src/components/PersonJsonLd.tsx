import { getTranslations } from 'next-intl/server';
import { EXPERIENCE, PROFILE, SKILL_GROUPS, SOCIALS, TECH_TAGS } from '@/content/cv';
import { SITE_URL } from '@/lib/site';

/**
 * schema.org `Person` markup so search engines can attribute the page correctly
 * and surface the role, skills and profile links.
 */
export async function PersonJsonLd({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'hero' });
  const tMeta = await getTranslations({ locale, namespace: 'meta' });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: `${PROFILE.firstName} ${PROFILE.lastName}`,
    givenName: PROFILE.firstName,
    familyName: PROFILE.lastName,
    jobTitle: t('role'),
    description: tMeta('description'),
    email: `mailto:${PROFILE.email}`,
    birthDate: PROFILE.dateOfBirth,
    url: `${SITE_URL}/${locale}`,
    image: `${SITE_URL}${PROFILE.avatar}`,
    sameAs: SOCIALS.map((social) => social.href),
    knowsAbout: [...SKILL_GROUPS.map((skill) => skill.label), ...TECH_TAGS],
    worksFor: {
      '@type': 'Organization',
      name: EXPERIENCE[0].company,
    },
  };

  return (
    <script
      type="application/ld+json"
      // Serialised server-side from static content; no user input involved.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
