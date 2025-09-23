import type { IError } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

import { api } from '@/app/api';
import { getCachedData, setCachedData } from '@/app/api/utils/cache';
import getSearchParams from '@/app/api/utils/getSearchParams';
import { LanguageEnum } from '@/app/types/enum';
import { handleApiError, isIError } from '@/app/utils/errorHandler';

/**
 * Get all products with pagination and filter.
 *
 * @async
 * @param props
 * @see {@link https://doc.oneentry.cloud/docs/catalog OneEntry CMS docs}
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry SDK docs}
 *
 * @returns Array with ProductEntity objects
 */
export const getProducts = async (props: {
  offset: number;
  limit: number;
  lang: string;
  params?: {
    handle?: string;
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
  error?: IError;
  products?: IProductsEntity[];
  total: number;
}> => {
  const { offset, limit, params, lang } = props;
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  const body = getSearchParams(params?.searchParams, params?.handle);

  // Create cache key from parameters
  const cacheKey = `products-${JSON.stringify({ offset, limit, langCode, body })}`;

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
    const data = await api.Products.getProducts(body || undefined, langCode, {
      limit,
      offset,
      sortOrder: 'ASC',
      sortKey: 'date',
    });
    if (isIError(data)) {
      return {
        isError: true,
        error: data,
        total: 0,
      };
    } else {
      // Cache the result
      setCachedData<{ products: IProductsEntity[]; total: number }>(cacheKey, {
        products: data.items,
        total: data.total,
      });
      return {
        isError: false,
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
      total: 0,
    };
  }
};
