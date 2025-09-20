import type { IError } from 'oneentry/dist/base/utils';
import type {
  IProductsEntity,
  IProductsResponse,
} from 'oneentry/dist/products/productsInterfaces';

import { api } from '@/app/api';
import { getCachedData, setCachedData } from '@/app/api/utils/cache';
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
 * @param id Product page identifier for which to find relationship.
 * @param lang Current language shortcode
 * @see {@link https://doc.oneentry.cloud/docs/catalog OneEntry CMS docs}
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry SDK docs}
 *
 * @returns  Array with ProductEntity objects
 */
export const getRelatedProductsById = async (
  id: number,
  lang: string,
): Promise<RelatedProductsResult> => {
  // Validate inputs
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

  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];

  // Validate language code
  if (!langCode) {
    return {
      isError: true,
      error: {
        statusCode: 400,
        message: `Unsupported language: ${lang}`,
      } as IError,
      total: 0,
    };
  }

  const cacheKey = `related-products-${id}-${langCode}`;

  // Check cache first
  const cached = getCachedData<{ products: IProductsEntity[]; total: number }>(
    cacheKey,
  );
  if (cached) {
    return {
      isError: false,
      products: cached.products,
      total: cached.total,
    };
  }

  try {
    const data = await api.Products.getRelatedProductsById(id, langCode);

    if (isIError(data)) {
      return { isError: true, error: data as IError, total: 0 };
    } else {
      // Type assertion to ensure we're working with the correct type
      const productsResponse = data as IProductsResponse;

      // Cache the result
      setCachedData<{ products: IProductsEntity[]; total: number }>(cacheKey, {
        products: productsResponse.items,
        total: productsResponse.total,
      });

      return {
        isError: false,
        products: productsResponse.items,
        total: productsResponse.total,
      };
    }
  } catch (error) {
    const apiError = handleApiError(error);
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
