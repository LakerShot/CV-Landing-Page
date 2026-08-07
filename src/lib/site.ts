/**
 * Canonical origin, used for metadataBase, hreflang, OG URLs and the sitemap.
 *
 * Vercel exposes the deployment host as `VERCEL_PROJECT_PRODUCTION_URL` (without
 * a scheme). Set `NEXT_PUBLIC_SITE_URL` to override once a custom domain is
 * attached; the localhost default keeps development URLs sane.
 */
function resolveSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return 'http://localhost:3000';
}

export const SITE_URL = resolveSiteUrl();
