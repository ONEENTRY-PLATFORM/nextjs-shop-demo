import type { MetadataRoute } from 'next';

import { getChildPagesByParentUrl, getProducts } from '@/app/api';
import { getSiteUrl } from '@/app/utils/getSiteUrl';
import { i18n } from '@/i18n-config';

/** Products requested per round-trip while walking the catalog. */
const PRODUCTS_PAGE_SIZE = 100;

/**
 * Safety stop for the catalog walk.
 *
 * `total` comes from the CMS, so a runaway value would otherwise turn one
 * sitemap request into an unbounded loop. A sitemap may hold 50 000 URLs; this
 * cap stays well inside that while covering any realistic catalog.
 */
const MAX_PRODUCTS = 5000;

/**
 * Collects every product id for one locale, following `total` across pages.
 *
 * A single request would silently truncate the catalog at the page size — the
 * failure mode the sitemap is supposed to prevent, and invisible in both the UI
 * and the logs.
 * @param   {string}            lang - Language shortcode.
 * @returns {Promise<number[]>}      Product ids, empty when the CMS is unreachable.
 */
const collectProductIds = async (lang: string): Promise<number[]> => {
  const ids: number[] = [];
  let offset = 0;

  while (offset < MAX_PRODUCTS) {
    const { isError, products, total } = await getProducts({
      offset,
      limit: PRODUCTS_PAGE_SIZE,
      lang,
    });

    /** CMS outage: keep whatever was collected instead of failing the route. */
    if (isError || !products?.length) {
      break;
    }

    for (const product of products) {
      ids.push(product.id);
    }

    offset += PRODUCTS_PAGE_SIZE;
    if (offset >= total) {
      break;
    }
  }

  return ids;
};

/**
 * Collects the catalog category handles for one locale.
 *
 * Categories are the direct children of the `shop` page, which is how
 * `/{lang}/shop/{handle}` resolves them.
 * @param   {string}            lang - Language shortcode.
 * @returns {Promise<string[]>}      Category page URLs, empty when the CMS is unreachable.
 */
const collectCategoryHandles = async (lang: string): Promise<string[]> => {
  const { isError, pages } = await getChildPagesByParentUrl('shop', lang);

  if (isError || !pages?.length) {
    return [];
  }

  return pages
    .filter((page) => page.isVisible !== false && Boolean(page.pageUrl))
    .map((page) => page.pageUrl);
};

/**
 * Generate the sitemap from live CMS data.
 *
 * `lastModified` is deliberately omitted: neither `IPagesEntity` nor
 * `IProductsEntity` carries a modification date, and the previous `new Date()`
 * stamped every entry with "just now" on every build — a signal that is not
 * merely useless but actively misleading to a crawler deciding what to refetch.
 *
 * The route degrades instead of failing: if the CMS is unreachable, the static
 * roots are still returned, so a build never dies on a sitemap.
 * @returns {Promise<MetadataRoute.Sitemap>} Sitemap entries in Next.js MetadataRoute.Sitemap format.
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap Next.js docs}
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const entries: MetadataRoute.Sitemap = [];

  for (const loc of i18n.locales) {
    /** Locale root. */
    entries.push({
      url: `${baseUrl}/${loc}`,
      changeFrequency: 'daily',
      priority: 1,
    });

    /** Catalog root. */
    entries.push({
      url: `${baseUrl}/${loc}/shop`,
      changeFrequency: 'daily',
      priority: 0.8,
    });

    const [categoryHandles, productIds] = await Promise.all([
      collectCategoryHandles(loc),
      collectProductIds(loc),
    ]);

    for (const handle of categoryHandles) {
      entries.push({
        url: `${baseUrl}/${loc}/shop/${handle}`,
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }

    for (const id of productIds) {
      entries.push({
        url: `${baseUrl}/${loc}/shop/product/${id}`,
        changeFrequency: 'weekly',
        priority: 0.5,
      });
    }
  }

  return entries;
}
