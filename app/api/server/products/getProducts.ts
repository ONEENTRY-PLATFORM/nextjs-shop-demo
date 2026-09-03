import { unstable_cache } from 'next/cache';
import type { IError, IProductsEntity } from 'oneentry/types';
import { cache } from 'react';

import { getApi, isError } from '@/app/api/api/api';
import getSearchParams from '@/app/api/utils/getSearchParams';
import { toLangCode } from '@/app/types/enum';

/** Catalog filter search params accepted by the products fetchers. */
type ProductsSearchParams = {
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
 * @param   {string}               handle - Category handle ('' when absent).
 * @param   {ProductsSearchParams} sp     - Search params (normalized with defaults).
 * @returns {string}                      Stable JSON signature string.
 */
const buildProductsKey = (
  offset: number,
  limit: number,
  lang: string,
  handle: string,
  sp: ProductsSearchParams,
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
 * Cross-request Data Cache layer: stores the catalog page in the Next.js Data
 * Cache with a TTL and tags so repeat requests skip the OneEntry round-trip.
 * The first argument is the canonical signature that keys the cache entry.
 * @param   {string}               _signature - Canonical cache-key signature (see buildProductsKey).
 * @param   {number}               offset     - Offset for pagination.
 * @param   {number}               limit      - Limit for pagination.
 * @param   {string}               lang       - Language shortcode.
 * @param   {string}               handle     - Category handle ('' when absent).
 * @param   {ProductsSearchParams} sp         - Search params.
 * @returns {Promise<object>}                 Envelope with ProductEntity objects.
 */
const fetchProducts = unstable_cache(
  async (
    _signature: string,
    offset: number,
    limit: number,
    lang: string,
    handle: string,
    sp: ProductsSearchParams,
  ): Promise<{
    isError: boolean;
    error?: IError;
    products?: IProductsEntity[];
    total: number;
  }> => {
    const langCode = toLangCode(lang);
    const body = getSearchParams(sp, handle || undefined) || [];

    const data = await getApi().Products.getProducts(body, langCode, {
      limit,
      offset,
      sortOrder: 'ASC',
      sortKey: 'date',
    });

    if (isError(data)) {
      return { isError: true, error: data, total: 0 };
    }

    return { isError: false, products: data.items, total: data.total };
  },
  ['oneentry-getProducts'],
  { revalidate: 60, tags: ['oneentry', 'oneentry-products'] },
);

/**
 * Get all products with pagination and filter.
 * React cache() deduplicates within a single render; the inner unstable_cache
 * layer deduplicates between requests (performance rule).
 * @async
 * @param   {object}          props                                - Product parameters
 * @param   {number}          props.offset                         - Offset for pagination.
 * @param   {number}          props.limit                          - Limit for pagination.
 * @param   {string}          props.lang                           - Language shortcode.
 * @param   {object}          [props.params]                       - Search parameters.
 * @param   {string}          [props.params.handle]                - Product handle.
 * @param   {object}          [props.params.searchParams]          - Search parameters.
 * @param   {string}          [props.params.searchParams.search]   - Search query.
 * @param   {string}          [props.params.searchParams.in_stock] - Filter by in stock status.
 * @param   {string}          [props.params.searchParams.color]    - Filter by color.
 * @param   {string}          [props.params.searchParams.minPrice] - Filter by minimum price.
 * @param   {string}          [props.params.searchParams.maxPrice] - Filter by maximum price.
 * @returns {Promise<object>}                                      Array with ProductEntity objects
 * @see {@link https://doc.oneentry.cloud/docs/catalog OneEntry CMS docs}
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry SDK docs}
 */
export const getProducts = cache(
  async (props: {
    offset: number;
    limit: number;
    lang: string;
    params?: {
      handle?: string;
      searchParams?: ProductsSearchParams;
    };
  }): Promise<{
    isError: boolean;
    error?: IError;
    products?: IProductsEntity[];
    total: number;
  }> => {
    const { limit, offset, params, lang } = props;
    const handle = params?.handle ?? '';
    const sp = params?.searchParams ?? {};

    return fetchProducts(
      buildProductsKey(offset, limit, lang, handle, sp),
      offset,
      limit,
      lang,
      handle,
      sp,
    );
  },
);
