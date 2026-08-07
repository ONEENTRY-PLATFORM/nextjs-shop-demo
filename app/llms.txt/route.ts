import { getSiteUrl } from '@/app/utils/getSiteUrl';
import { i18n } from '@/i18n-config';

/**
 * Regenerate at most once a day — the content is a static outline of the site's
 * sections, not live catalogue data.
 */
export const revalidate = 86400;

/**
 * `/llms.txt` — a plain-text map of the site for LLM agents and AI crawlers, per
 * the llms.txt convention (<https://llmstxt.org>): an H1 name, a one-line
 * summary as a blockquote, then sections of `- [title](url): description` links.
 *
 * Implemented as a route handler rather than a file in `public/` so the origin
 * comes from {@link getSiteUrl} instead of being hardcoded — the same mistake
 * that left `robots.txt` advertising an uninterpolated `${NEXT_PUBLIC_PROJECT_URL}`.
 * @returns {Response} `text/plain` body describing the storefront.
 */
export async function GET(): Promise<Response> {
  const siteUrl = getSiteUrl();
  const { defaultLocale, locales } = i18n;

  /** Sections that exist for every locale, in reading order. */
  const sections: Array<{ path: string; title: string; description: string }> =
    [
      {
        path: '',
        title: 'Home',
        description:
          'Landing page with promotional blocks: catalog, promotions, best sellers, new arrivals and the offer of the day.',
      },
      {
        path: '/shop',
        title: 'Shop',
        description:
          'Full product catalogue with search, filtering by price, colour and availability, sorting and paginated loading.',
      },
      {
        path: '/shop/category',
        title: 'Categories',
        description:
          'Category overview; each category lists the products assigned to it in the CMS.',
      },
      {
        path: '/cart',
        title: 'Cart',
        description:
          'Cart contents, delivery date selection and order totals before checkout.',
      },
      {
        path: '/payment',
        title: 'Checkout',
        description:
          'Payment method selection and order creation (Stripe and cash on delivery).',
      },
      {
        path: '/orders',
        title: 'Orders',
        description:
          'Order history for the signed-in user, with repeat and cancel actions.',
      },
      {
        path: '/favorites',
        title: 'Favorites',
        description: 'Products the signed-in user has marked as favourites.',
      },
      {
        path: '/profile',
        title: 'Profile',
        description: 'Account details of the signed-in user.',
      },
    ];

  const lines: Array<string> = [
    '# OneEntry Shop',
    '',
    '> Demo toy store built with Next.js (App Router) on top of the OneEntry headless CMS. All catalogue content, pages, forms and orders come from the CMS through the `oneentry` SDK.',
    '',
    `Available in ${locales.length} languages: ${locales.join(', ')}. Paths below use the default locale \`${defaultLocale}\`; swap the first path segment for another locale.`,
    '',
    '## Pages',
    '',
    ...sections.map(
      (s) =>
        `- [${s.title}](${siteUrl}/${defaultLocale}${s.path}): ${s.description}`,
    ),
    '',
    '## Notes',
    '',
    `- Product pages live at \`${siteUrl}/${defaultLocale}/shop/product/<handle>\`.`,
    `- A machine-readable list of indexable URLs is published at ${siteUrl}/sitemap.xml.`,
    '- Prices, stock levels and reviews are editorial data from the CMS and change without notice.',
    '- Cart, checkout, orders, favourites and profile require authentication and hold no public content.',
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=0, s-maxage=86400',
    },
  });
}
