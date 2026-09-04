import type { Metadata } from 'next';

import {
  isFilteredShopView,
  type ShopSearchParams,
} from '@/app/utils/isFilteredShopView';

/**
 * Robots overlay for catalog listings: keeps the bare listing indexable and
 * de-indexes every filtered/searched/paginated variant.
 *
 * Six facet keys combine into an unbounded number of URLs that carry no unique
 * content, and each one is a fresh CMS-backed render. `generateMetadata` here
 * did not read `searchParams` at all, so every combination announced itself as
 * indexable.
 *
 * `follow` stays `true` throughout: the links out of a filtered listing lead to
 * real product pages, and pagination is how a crawler walks past the first
 * screen of a category. Nothing is hidden, only the duplicate listing URLs are
 * kept out of the index.
 *
 * The canonical is deliberately **not** set here — `generatePageMetadata`
 * already emits one pointing at the clean `path`, which is what collapses the
 * variants onto the bare listing. Setting it in both places would mean two
 * sources of truth for the same tag.
 * @param   {object}                  options              - Overlay options.
 * @param   {ShopSearchParams}        options.searchParams - Resolved page `searchParams` map.
 * @param   {boolean}                 [options.isVisible]  - Whether the CMS page itself is indexable (defaults to `true`).
 * @returns {Pick<Metadata,'robots'>}                      A `robots` overlay to merge into the page metadata.
 */
export const shopCrawlMeta = ({
  searchParams,
  isVisible = true,
}: {
  searchParams: ShopSearchParams;
  isVisible?: boolean;
}): Pick<Metadata, 'robots'> => {
  const index = isVisible && !isFilteredShopView(searchParams);

  return {
    robots: {
      index,
      follow: true,
      googleBot: { index, follow: true },
    },
  };
};
