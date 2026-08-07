import type { MetadataRoute } from 'next';

import { getSiteUrl } from '@/app/utils/getSiteUrl';

/**
 * robots.txt, generated at request/build time.
 *
 * Replaces a **static** `app/robots.txt` that contained the literal text
 * `Sitemap: ${NEXT_PUBLIC_PROJECT_URL}/sitemap.xml` — static files are served
 * verbatim, so the template string was never interpolated and production served
 * an unusable sitemap reference (Lighthouse SEO: "robots.txt is not valid —
 * Invalid sitemap URL"). Anything that needs an environment value has to be a
 * generated route, not a static file.
 * @returns {MetadataRoute.Robots} Robots rules with a resolved sitemap URL.
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        /** Authenticated/user-specific routes have nothing to index. */
        disallow: ['/api/', '/*/auth/', '/*/profile', '/*/orders', '/*/cart'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
