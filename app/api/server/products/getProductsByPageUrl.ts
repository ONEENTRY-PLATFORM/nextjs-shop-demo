import type { IError } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

import { api } from '@/app/api';
import { getCachedData, setCachedData } from '@/app/api/utils/cache';
import getSearchParams from '@/app/api/utils/getSearchParams';
import { LanguageEnum } from '@/app/types/enum';
import { handleApiError, isIError } from '@/app/utils/errorHandler';

/**
 * Get all products with pagination for the selected category.
 * @async
 * @param props
 * @see {@link https://doc.oneentry.cloud/docs/catalog OneEntry CMS docs}
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry SDK docs}
 *
 * @returns Array with ProductEntity objects
 */
export const getProductsByPageUrl = async (props: {
  lang: string;
  offset: number;
  limit: number;
  params: {
    handle: string;
    searchParams?: {
      search?: string;
      in_stock?: string;
      color?: string;
      minPrice?: string;
      maxPrice?: string;
    };
  };
}): Promise<{
  isError: boolean;
  error: IError;
  products: IProductsEntity[] | [];
  total: number;
}> => {
  const { limit, offset, params, lang } = props;
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  const body = getSearchParams(params.searchParams);

  // Create cache key from parameters
  const cacheKey = `products-page-${JSON.stringify({ limit, offset, params, langCode, body })}`;

  // Check cache first
  const cached = getCachedData<{ products: IProductsEntity[]; total: number }>(
    cacheKey,
  );
  if (cached) {
    return {
      isError: false,
      error: {} as IError,
      products: cached.products,
      total: cached.total,
    };
  }

  try {
    const data = await api.Products.getProductsByPageUrl(
      params.handle,
      body,
      langCode,
      {
        sortOrder: 'DESC',
        sortKey: 'date',
        offset: offset,
        limit: limit,
      },
    );

    if (isIError(data)) {
      return { isError: true, error: data, products: [], total: 0 };
    } else {
      // Cache the result
      setCachedData<{ products: IProductsEntity[]; total: number }>(cacheKey, {
        products: data.items,
        total: data.total,
      });
      return {
        isError: false,
        error: {} as IError,
        products: data.items,
        total: data.total,
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
      products: [],
      total: 0,
    };
  }
};
