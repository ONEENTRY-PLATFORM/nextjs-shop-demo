import type { IError } from 'oneentry/dist/base/utils';
import type {
  IProductsEntity,
  IProductsResponse,
} from 'oneentry/dist/products/productsInterfaces';

import { api } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';
import { handleApiError, isIError } from '@/app/utils/errorHandler';

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
  /** Validate inputs */
  if (!id || id <= 0) {
    /** Return error for invalid product ID */
    return {
      isError: true,
      error: {
        statusCode: 400,
        message: 'Invalid product ID provided',
      } as IError,
      total: 0,
    };
  }

  /** Check if language parameter is provided */
  if (!lang) {
    /** Return error for missing language parameter */
    return {
      isError: true,
      error: {
        statusCode: 400,
        message: 'Language parameter is required',
      } as IError,
      total: 0,
    };
  }

  /** Get language code from LanguageEnum */
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];

  /** Validate language code */
  if (!langCode) {
    /** Return error for unsupported language */
    return {
      isError: true,
      error: {
        statusCode: 400,
        message: `Unsupported language: ${lang}`,
      } as IError,
      total: 0,
    };
  }

  /** Fetch related products by ID and language from the API */
  try {
    /** Call the API to get related products by ID and language */
    const data = await api.Products.getRelatedProductsById(id, langCode);

    /** Check if the response is an error */
    if (isIError(data)) {
      return { isError: true, error: data as IError, total: 0 };
    } else {
      /** Type assertion to ensure we're working with the correct type */
      const productsResponse = data as IProductsResponse;

      /** Return successful response with related products */
      return {
        isError: false,
        products: productsResponse.items,
        total: productsResponse.total,
      };
    }
  } catch (error) {
    /** Handle API errors */
    const apiError = handleApiError('getRelatedProductsById', error);
    /** Return error response with zero total */
    return {
      isError: true,
      error: {
        statusCode: apiError.statusCode,
        message: apiError.message,
      } as IError,
      total: 0,
    };
  }
};
