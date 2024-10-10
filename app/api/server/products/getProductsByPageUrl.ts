import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

import { api } from '@/app/api';
import getSearchParams from '@/app/api/utils/getSearchParams';
import { LanguageEnum } from '@/app/types/enum';

export const getProductsByPageUrl = async (props: {
  lang: string;
  limit: number;
  offset: number;
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
  products?: IProductsEntity[];
  total: number;
  isError: boolean;
  err?: unknown;
}> => {
  const { limit, offset, params, lang } = props;
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];

  const { searchParams } = params;
  const expandedFilters = getSearchParams(searchParams);

  const data = await api.Products.getProductsByPageUrl(
    params.handle,
    expandedFilters,
    langCode,
    {
      sortOrder: 'DESC',
      sortKey: 'id',
      offset: offset,
      limit: limit,
    },
  );

  return { isError: false, products: data.items, total: data.total };
};
