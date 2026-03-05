import type { IError } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

import { getApi } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';
import { isIError } from '@/app/utils/errorHandler';

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

  if (!langCode) {
    return { isError: true, error: { statusCode: 400, message: '' } as IError };
  }

  const data = await getApi().Products.getProductById(id, langCode);

  if (isIError(data)) {
    return { isError: true, error: data };
  }

  return { isError: false, product: data };
};
