import type { IError } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

import { api } from '@/app/api';
import { getCachedData, setCachedData } from '@/app/api/utils/cache';
import type { ApiResponse as CustomApiResponse } from '@/app/types/api';
import { LanguageEnum } from '@/app/types/enum';
import { handleApiError, isIError } from '@/app/utils/errorHandler';

/**
 * Generic API response structure
 */
export type ApiResponse<T = unknown> = {
  isError: boolean;
  error?: {
    statusCode: number;
    message: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} & (T extends { [key: string]: any } ? T : object);

/**
 * Get product by id.
 * @async
 * @param id Product id.
 * @param lang Current language shortcode
 * @see {@link https://doc.oneentry.cloud/docs/catalog OneEntry CMS docs}
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry SDK docs}
 *
 * @returns ProductEntity object
 */
export const getProductById = async (
  id: number,
  lang: string,
): Promise<
  CustomApiResponse<{
    isError: boolean;
    error?: IError;
    product?: IProductsEntity;
  }>
> => {
  // Validate inputs
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

  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];

  // Validate language code
  if (!langCode) {
    return {
      isError: true,
      error: {
        statusCode: 400,
        message: 'Invalid language code',
      } as IError,
    };
  }

  try {
    // Try to get from cache first
    const cacheKey = `product_${id}_${langCode}`;
    const cachedProduct = getCachedData<IProductsEntity>(cacheKey);

    if (cachedProduct) {
      return {
        isError: false,
        product: cachedProduct,
      } as CustomApiResponse<{
        isError: boolean;
        error?: IError;
        product?: IProductsEntity;
      }>;
    }

    // Fetch from API
    const product = await api.Products.getProductById(id, langCode);

    if (isIError(product)) {
      return {
        isError: true,
        error: handleApiError(product),
      } as CustomApiResponse<{
        isError: boolean;
        error?: IError;
        product?: IProductsEntity;
      }>;
    }

    // Cache the result
    setCachedData(cacheKey, product as IProductsEntity);

    return {
      isError: false,
      product: product as IProductsEntity,
    } as CustomApiResponse<{
      isError: boolean;
      error?: IError;
      product?: IProductsEntity;
    }>;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return {
      isError: true,
      error: {
        statusCode: 500,
        message: 'Internal server error',
      } as IError,
    } as CustomApiResponse<{
      isError: boolean;
      error?: IError;
      product?: IProductsEntity;
    }>;
  }
};
