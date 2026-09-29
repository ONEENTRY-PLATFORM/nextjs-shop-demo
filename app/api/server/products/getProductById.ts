import { unstable_cache } from 'next/cache';
import type { IError, IProductsEntity } from 'oneentry/types';
import { cache } from 'react';

import { getApi, isError } from '@/app/api/api/api';
import { toLangCode } from '@/app/types/enum';

/** Total attempts (first try plus retries) for one product read. */
const PRODUCT_FETCH_ATTEMPTS = 3;

/** Base backoff between product read attempts; multiplied by the attempt number. */
const PRODUCT_RETRY_DELAY_MS = 250;

/**
 * Cross-request Data Cache layer: stores the product in the Next.js Data
 * Cache with a TTL and tags so repeat requests skip the OneEntry round-trip.
 *
 * Same contract as the menu reader in `app/api/server/menus/getMenuByMarker.ts`: a read that fails for any reason other than the
 * shopper not being allowed to see the product **throws** rather than returning an envelope.
 * A returned value is written to the Data Cache, and the caller turns an error envelope into
 * `notFound()` — so a transient CMS failure used to be frozen as a 404 for the whole TTL, and
 * during `next build` baked into the static page until the next deploy. One build shipped 8 of
 * 54 English product pages as 404 that way, every one of those products live in the CMS; the
 * platform had answered `<!DOCTYPE …>` instead of JSON (`statusCode: 0`) under the prerender
 * burst.
 *
 * 404 and 403 are the exception: gone, and closed to this user group — `/api/content/products/{id}`
 * is a `readRestrictionRule` route on this project, so a restricted item answers 403 to a guest.
 * Both are stable facts about the product, not about the CMS, and both mean the shopper gets a
 * 404 page. They are returned, cached and never retried.
 * @param   {number}          id   - Product id.
 * @param   {string}          lang - Current language shortcode.
 * @returns {Promise<object>}      Envelope with ProductEntity object.
 * @throws  {IError}               When the CMS read fails for any other reason.
 */
const fetchProductById = unstable_cache(
  async (
    id: number,
    lang: string,
  ): Promise<{
    isError: boolean;
    error?: IError;
    product?: IProductsEntity;
  }> => {
    const langCode = toLangCode(lang);

    if (!langCode) {
      return {
        isError: true,
        error: { statusCode: 400, message: '' } as IError,
      };
    }

    let lastError: IError | undefined;
    for (let attempt = 0; attempt < PRODUCT_FETCH_ATTEMPTS; attempt++) {
      const data = await getApi().Products.getProductById(id, langCode);

      if (!isError(data)) {
        return { isError: false, product: data };
      }

      if (data.statusCode === 404 || data.statusCode === 403) {
        return { isError: true, error: data };
      }

      lastError = data;
      if (attempt < PRODUCT_FETCH_ATTEMPTS - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, PRODUCT_RETRY_DELAY_MS * (attempt + 1)),
        );
      }
    }

    throw lastError;
  },
  ['oneentry-getProductById'],
  { revalidate: 60, tags: ['oneentry', 'oneentry-products'] },
);

/**
 * Get product by id.
 * React cache() deduplicates within a single render (generateMetadata and the
 * page body share one in-flight promise); the inner unstable_cache layer
 * deduplicates between requests (performance rule).
 * @param   {number}          id   - Product id.
 * @param   {string}          lang - Current language shortcode.
 * @returns {Promise<object>}      ProductEntity object
 * @see {@link https://doc.oneentry.cloud/docs/catalog OneEntry CMS docs}
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry SDK docs}
 */
export const getProductById = cache(
  async (
    id: number,
    lang: string,
  ): Promise<{
    isError: boolean;
    error?: IError;
    product?: IProductsEntity;
  }> => {
    if (!id || id <= 0) {
      return {
        isError: true,
        error: {
          statusCode: 400,
          message: 'Invalid product ID provided',
        } as IError,
      };
    }

    if (!lang) {
      return {
        isError: true,
        error: {
          statusCode: 400,
          message: 'Language parameter is required',
        } as IError,
      };
    }

    return fetchProductById(id, lang);
  },
);
