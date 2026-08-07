/**
 * Canonical origin of **this site** — the storefront users and crawlers visit.
 *
 * Deliberately does NOT consider `NEXT_PUBLIC_PROJECT_URL`: that variable holds
 * the OneEntry **CMS API** origin (`https://<project>.oneentry.cloud`), which is
 * a different host entirely. Using it as the site origin published a sitemap
 * full of `<loc>https://react-native-course.oneentry.cloud/en</loc>` — URLs that
 * do not exist there — and pointed `metadataBase` at the CMS as well.
 *
 * Resolution order:
 * 1. `NEXT_PUBLIC_SITE_URL` — the explicit canonical origin; set this in prod.
 * 2. `NEXT_PUBLIC_VERCEL_URL` — project-level fallback kept in `.env*`.
 * 3. `VERCEL_PROJECT_PRODUCTION_URL` — injected by Vercel, host only.
 * 4. `VERCEL_URL` — injected by Vercel for preview deployments, host only.
 * 5. `http://localhost:3000` — local development only.
 * @returns {string} Origin without a trailing slash, always with a scheme.
 */
export const getSiteUrl = (): string => {
  const candidate =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_VERCEL_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL;

  if (!candidate) {
    return 'http://localhost:3000';
  }

  /** Vercel-injected variables carry a bare host, so add the scheme back. */
  const withScheme = /^https?:\/\//.test(candidate)
    ? candidate
    : `https://${candidate}`;

  return withScheme.replace(/\/+$/, '');
};
