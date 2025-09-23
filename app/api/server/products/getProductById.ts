import type { IError } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

import { api } from '@/app/api';
import { getCachedData, setCachedData } from '@/app/api/utils/cache';
import { LanguageEnum } from '@/app/types/enum';
import { handleApiError, isIError } from '@/app/utils/errorHandler';

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
): Promise<{
  isError: boolean;
  error?: IError;
  product?: IProductsEntity;
}> => {
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
        message: `Unsupported language: ${lang}`,
      } as IError,
    };
  }

  const cacheKey = `product-${id}-${langCode}`;

  // Check cache first
  const cached = getCachedData<IProductsEntity>(cacheKey);
  if (cached) {
    return { isError: false, product: cached };
  }

  try {
    const data = await api.Products.getProductById(id, langCode);

    if (isIError(data)) {
      return { isError: true, error: data };
    } else {
      // Cache the result
      setCachedData<IProductsEntity>(cacheKey, data);
      return { isError: false, product: data };
    }
  } catch (error) {
    const apiError = handleApiError(error);
    return {
      isError: true,
      error: {
        statusCode: apiError.statusCode,
        message: apiError.message,
      } as IError,
    };
  }
};
