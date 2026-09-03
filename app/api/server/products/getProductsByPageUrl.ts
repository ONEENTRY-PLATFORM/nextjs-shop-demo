import { unstable_cache } from 'next/cache';
import type { IError, IProductsEntity } from 'oneentry/types';
import { cache } from 'react';

import { getApi, isError } from '@/app/api/api/api';
import getSearchParams from '@/app/api/utils/getSearchParams';
import { toLangCode } from '@/app/types/enum';

/** Catalog filter search params accepted by the category products fetcher. */
type CategorySearchParams = {
  search?: string;
  in_stock?: string;
  color?: string;
  minPrice?: string;
  maxPrice?: string;
};

/**
 * Builds a canonical cache-key signature from the object arguments —
 * unstable_cache serializes objects positionally, so different property order
 * would otherwise create separate cache entries (performance rule).
 * @param   {number}               offset - Offset for pagination.
 * @param   {number}               limit  - Limit for pagination.
 * @param   {string}               lang   - Language shortcode.
 * @param   {string}               handle - Category handle.
 * @param   {CategorySearchParams} sp     - Search params (normalized with defaults).
 * @returns {string}                      Stable JSON signature string.
 */
const buildCategoryKey = (
  offset: number,
  limit: number,
  lang: string,
  handle: string,
  sp: CategorySearchParams,
): string =>
  JSON.stringify([
    offset,
    limit,
    lang,
    handle,
    {
      search: sp.search ?? '',
      in_stock: sp.in_stock ?? '',
      color: sp.color ?? '',
      minPrice: sp.minPrice ?? '',
      maxPrice: sp.maxPrice ?? '',
    },
  ]);

/**
 * Cross-request Data Cache layer: stores the category page in the Next.js
 * Data Cache with a TTL and tags so repeat requests skip the OneEntry
 * round-trip. The first argument is the canonical signature that keys the
 * cache entry.
 * @param   {string}               _signature - Canonical cache-key signature (see buildCategoryKey).
 * @param   {number}               offset     - Offset for pagination.
 * @param   {number}               limit      - Limit for pagination.
 * @param   {string}               lang       - Language shortcode.
 * @param   {string}               handle     - Category handle.
 * @param   {CategorySearchParams} sp         - Search params.
 * @returns {Promise<object>}                 Envelope with ProductEntity objects.
 */
const fetchProductsByPageUrl = unstable_cache(
  async (
    _signature: string,
    offset: number,
    limit: number,
    lang: string,
    handle: string,
    sp: CategorySearchParams,
  ): Promise<{
    isError: boolean;
    error: IError;
    products: IProductsEntity[] | [];
    total: number;
  }> => {
    const langCode = toLangCode(lang);
    const body = getSearchParams(sp);

    const data = await getApi().Products.getProductsByPageUrl(
      handle,
      body,
      langCode,
      { sortOrder: 'DESC', sortKey: 'date', offset, limit },
    );

    if (isError(data)) {
      return { isError: true, error: data, products: [], total: 0 };
    }

    return {
      isError: false,
      error: {} as IError,
      products: data.items,
      total: data.total,
    };
  },
  ['oneentry-getProductsByPageUrl'],
  { revalidate: 60, tags: ['oneentry', 'oneentry-products'] },
);

/**
 * Get all products with pagination for the selected category.
 * React cache() deduplicates within a single render; the inner unstable_cache
 * layer deduplicates between requests (performance rule).
 * @async
 * @param   {object}          props                              - Object containing the language, offset, limit, and parameters.
 * @param   {string}          props.lang                         - Language shortcode.
 * @param   {number}          props.offset                       - Offset for pagination.
 * @param   {number}          props.limit                        - Limit for pagination.
 * @param   {object}          props.params                       - Parameters for filtering products.
 * @param   {string}          props.params.handle                - Category handle.
 * @param   {object}          props.params.searchParams          - Search parameters.
 * @param   {string}          props.params.searchParams.search   - Search query.
 * @param   {string}          props.params.searchParams.in_stock - Filter by in stock status.
 * @param   {string}          props.params.searchParams.color    - Filter by color.
 * @param   {string}          props.params.searchParams.minPrice - Filter by minimum price.
 * @param   {string}          props.params.searchParams.maxPrice - Filter by maximum price.
 * @returns {Promise<object>}                                    Array with ProductEntity objects
 * @see {@link https://doc.oneentry.cloud/docs/catalog OneEntry CMS docs}
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry SDK docs}
 */
export const getProductsByPageUrl = cache(
  async (props: {
    lang: string;
    offset: number;
    limit: number;
    params: {
      handle: string;
      searchParams?: CategorySearchParams;
    };
  }): Promise<{
    isError: boolean;
    error: IError;
    products: IProductsEntity[] | [];
    total: number;
  }> => {
    const { limit, offset, params, lang } = props;
    const sp = params.searchParams ?? {};

    return fetchProductsByPageUrl(
      buildCategoryKey(offset, limit, lang, params.handle, sp),
      offset,
      limit,
      lang,
      params.handle,
      sp,
    );
  },
);
