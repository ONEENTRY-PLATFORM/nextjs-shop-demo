import { unstable_cache } from 'next/cache';
import type { IError, IProductsEntity } from 'oneentry/types';
import { cache } from 'react';

import { getApi, isError } from '@/app/api/api/api';
import { toLangCode } from '@/app/types/enum';

/**
 * Cross-request Data Cache layer: stores the product in the Next.js Data
 * Cache with a TTL and tags so repeat requests skip the OneEntry round-trip.
 * @param   {number}          id   - Product id.
 * @param   {string}          lang - Current language shortcode.
 * @returns {Promise<object>}      Envelope with ProductEntity object.
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

    const data = await getApi().Products.getProductById(id, langCode);

    if (isError(data)) {
      return { isError: true, error: data };
    }

    return { isError: false, product: data };
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
