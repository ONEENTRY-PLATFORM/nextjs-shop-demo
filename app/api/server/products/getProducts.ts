import type { IError } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

import { api } from '@/app/api';
import getSearchParams from '@/app/api/utils/getSearchParams';
import { LanguageEnum } from '@/app/types/enum';
import { typeError } from '@/components/utils';

/**
 * Get all products with pagination and filter.
 *
 * @param props
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry docs}
 *
 * @returns Array with ProductEntity objects
 */
export const getProducts = async (props: {
  limit: number;
  offset: number;
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
  const { limit, offset, params, lang } = props;
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  const expandedFilters = getSearchParams(params?.searchParams, params?.handle);

  try {
    const data = await api.Products.getProducts(expandedFilters, langCode, {
      sortOrder: 'ASC',
      sortKey: 'date',
      offset: offset,
      limit: limit,
    });
    if (typeError(data)) {
      return { isError: true, error: data, total: 0 };
    } else {
      return {
        isError: false,
        products: data.items,
        total: data.total,
      };
    }
  } catch (error) {
    return {
      isError: true,
      error: error as IError,
      total: 0,
    };
  }
};
