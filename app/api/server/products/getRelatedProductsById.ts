import type { IError } from 'oneentry/dist/base/utils';
import type {
  IProductsEntity,
  IProductsResponse,
} from 'oneentry/dist/products/productsInterfaces';

import { getApi, isError } from '@/app/api';
import { toLangCode } from '@/app/types/enum';

interface RelatedProductsResult {
  isError: boolean;
  error?: IError;
  products?: IProductsEntity[];
  total: number;
}

/**
 * Get all related product page objects with API.Products
 * @async
 * @param   {number}                         id   - Product page identifier for which to find relationship.
 * @param   {string}                         lang - Current language shortcode.
 * @returns {Promise<RelatedProductsResult>}      Array with ProductEntity objects
 * @see {@link https://doc.oneentry.cloud/docs/catalog OneEntry CMS docs}
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry SDK docs}
 */
export const getRelatedProductsById = async (
  id: number,
  lang: string,
): Promise<RelatedProductsResult> => {
  if (!id || id <= 0) {
    return {
      isError: true,
      error: {
        statusCode: 400,
        message: 'Invalid product ID provided',
      } as IError,
      total: 0,
    };
  }

  if (!lang) {
    return {
      isError: true,
      error: {
        statusCode: 400,
        message: 'Language parameter is required',
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

  const data = await getApi().Products.getRelatedProductsById(id, langCode);

  if (isError(data)) {
    return { isError: true, error: data as IError, total: 0 };
  }

  const productsResponse = data as IProductsResponse;

  return {
    isError: false,
    products: productsResponse.items,
    total: productsResponse.total,
  };
};
