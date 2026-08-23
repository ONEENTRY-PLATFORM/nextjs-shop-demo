import type {
  IError,
  IProductsEntity,
  IProductsResponse,
} from 'oneentry/types';
import { cache } from 'react';

import { getApi, isError } from '@/app/api';
import { toLangCode } from '@/app/types/enum';

interface SimilarProductsResult {
  isError: boolean;
  error?: IError;
  /** Products of the requested page, with the current product excluded */
  products?: IProductsEntity[];
  /**
   * Raw API total across all pages (may count the current product when it
   * matches the block rules) — use with raw offsets for pagination math
   */
  total: number;
}

/**
 * Fallback portion size for the similar products infinite scroll — used only
 * when the block has no `quantity`. The actual portion size (first
 * server-rendered portion and every client-loaded page) is the block's
 * Quantity from admin. Note: the API caps `total` at quantity and rejects
 * offsets beyond it (400, verified on live API 2026-07-02), so with
 * portion = quantity the whole pool arrives with SSR and the client loads
 * more only if the API ever reports `total` above the first portion.
 */
export const SIMILAR_PRODUCTS_PAGE_SIZE = 5;

/**
 * Get similar products of a similar_products_block, evaluated in the context
 * of a specific product.
 *
 * Unlike the SDK's getBlockByMarker enrichment (which fetches the block's
 * similar products without product context), this passes `productId` so the
 * block's similarProductRules are applied relative to the given product, and
 * excludes the product itself from the result (the API includes it when it
 * matches the rules — verified against live data).
 *
 * Isomorphic: safe to call from Client Components too (infinite scroll in
 * RelatedItems) — cache() deduplicates per request on the server and is a
 * passthrough in the client build.
 *
 * Deliberately NOT wrapped in `unstable_cache`, unlike its sibling fetchers:
 * `RelatedItemsGrid` is a `'use client'` component that calls this directly,
 * and `next/cache` is server-only — importing it here would pull server code
 * into the client bundle and break the build. Adding the cross-request cache
 * layer requires first moving the client path behind a Server Action.
 *
 * Pagination is capped by the block's quantity: the API reports
 * `total = min(matching pool, quantity)` and returns 400 for offsets beyond
 * it (verified on live API 2026-07-02).
 * @async
 * @param   {string}                         marker      - Block marker (identifier) of a similar_products_block.
 * @param   {string}                         lang        - Current language shortcode.
 * @param   {number}                         [productId] - Product id to evaluate the block rules against and exclude from the result.
 * @param   {number}                         [limit]     - Max products to fetch. Default: 30.
 * @param   {number}                         [offset]    - Raw pagination offset (counted before the current product is excluded). Default: 0.
 * @returns {Promise<SimilarProductsResult>}             Object with the page's products array and the raw total count
 * @see {@link https://js-sdk.oneentry.cloud/docs/blocks/getSimilarProducts OneEntry SDK docs}
 */
export const getSimilarProductsByBlock = cache(
  async (
    marker: string,
    lang: string,
    productId?: number,
    limit: number = 30,
    offset: number = 0,
  ): Promise<SimilarProductsResult> => {
    if (!marker) {
      return {
        isError: true,
        error: {
          statusCode: 400,
          message: 'Block marker is required',
        } as IError,
        total: 0,
      };
    }

    const langCode = toLangCode(lang);

    if (!langCode) {
      return {
        isError: true,
        error: {
          statusCode: 400,
          message: 'Unsupported language: ' + lang,
        } as IError,
        total: 0,
      };
    }

    /**
     * getSimilarProducts is declared private in the SDK typings, but the
     * underlying /blocks/{marker}/similar-products endpoint is public —
     * narrow-cast at the call site to reach it.
     */
    const blocksApi = getApi().Blocks as unknown as {
      getSimilarProducts(
        marker: string,
        langCode?: string,
        offset?: number,
        limit?: number,
        signPrice?: string,
        productId?: number,
      ): Promise<IProductsResponse | IError>;
    };

    const data = await blocksApi.getSimilarProducts(
      marker,
      langCode,
      offset,
      limit,
      undefined,
      productId,
    );

    if (isError(data)) {
      return { isError: true, error: data, total: 0 };
    }

    const items = productId
      ? (data.items || []).filter((p) => p.id !== productId)
      : data.items || [];

    return {
      isError: false,
      products: items,
      total: data.total ?? items.length,
    };
  },
);
