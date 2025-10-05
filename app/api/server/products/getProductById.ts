import type { IError } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

import { api } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';
import { handleApiError, isIError } from '@/app/utils/errorHandler';

/**
 * Get product by id.
 * @param   {number}          id   - Product id.
 * @param   {string}          lang - Current language shortcode.
 * @returns {Promise<object>}      ProductEntity object
 * @see {@link https://doc.oneentry.cloud/docs/catalog OneEntry CMS docs}
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry SDK docs}
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

  try {
    const data = await api.Products.getProductById(id, langCode);

    if (isIError(data)) {
      return { isError: true, error: data };
    } else {
      return { isError: false, product: data };
    }
  } catch (error) {
    const apiError = handleApiError('getProductById', error);
    return {
      isError: true,
      error: {
        statusCode: apiError.statusCode,
        message: apiError.message,
      } as IError,
    };
  }
};
