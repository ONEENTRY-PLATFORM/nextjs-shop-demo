import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

import { api } from '@/app/api';
import getSearchParams from '@/app/api/utils/getSearchParams';
import { LanguageEnum } from '@/app/types/enum';
import { typeError } from '@/components/utils';

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
  products?: IProductsEntity[];
  total: number;
}> => {
  const { limit, offset, params, lang } = props;
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  // const searchValue = params?.searchParams?.search || '';
  const expandedFilters = getSearchParams(params?.searchParams, params?.handle);

  const data = await api.Products.getProducts(expandedFilters, langCode, {
    sortOrder: 'DESC',
    sortKey: 'id',
    offset: offset,
    limit: limit,
  });

  if (typeError(data)) {
    return { isError: true, total: 0 };
  } else {
    return {
      isError: false,
      products: data.items,
      total: data.total,
    };
  }
};
