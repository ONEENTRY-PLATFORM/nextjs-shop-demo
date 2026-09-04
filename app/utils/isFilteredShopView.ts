/** Resolved page `searchParams` shape (post-`await`). */
export type ShopSearchParams =
  Record<string, string | string[] | undefined> | undefined;

/**
 * URL search-param keys that turn a catalog listing into a non-canonical
 * (filtered / searched / paginated) view.
 *
 * The full set of keys the UI ever writes: `search` (`SearchInput`), the four
 * facet keys applied together by the filter drawer's `ApplyButton`, and `page`
 * from `Pagination` / `LoadMore`. Keep in sync with those components — a key
 * missing here silently becomes an indexable duplicate of the bare listing.
 */
const NON_CANONICAL_PARAMS = [
  'search',
  'page',
  'minPrice',
  'maxPrice',
  'color',
  'in_stock',
] as const;

/**
 * Whether the inbound `searchParams` describe a filtered/searched/paginated
 * catalog view rather than the bare canonical listing.
 *
 * `page=1` counts as canonical (it is the bare listing under another name), as
 * do absent and empty values — a reset filter leaves `?color=` behind rather
 * than removing the key.
 * @param   {ShopSearchParams} searchParams - Resolved page `searchParams` map.
 * @returns {boolean}                       `true` when at least one filter/search/pagination param is set.
 */
export const isFilteredShopView = (searchParams: ShopSearchParams): boolean => {
  if (!searchParams) {
    return false;
  }
  return NON_CANONICAL_PARAMS.some((key) => {
    const value = searchParams[key];
    if (value == null || value === '') {
      return false;
    }
    if (key === 'page') {
      const raw = Array.isArray(value) ? value[0] : value;
      return Number(raw) > 1;
    }
    return Array.isArray(value) ? value.length > 0 : true;
  });
};
