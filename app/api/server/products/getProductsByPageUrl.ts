import type { IError } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

import { api } from '@/app/api';
import getSearchParams from '@/app/api/utils/getSearchParams';
import { LanguageEnum } from '@/app/types/enum';
import { typeError } from '@/components/utils';

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
  isError: boolean;
  error?: IError;
  products?: IProductsEntity[];
  total: number;
}> => {
  const { limit, offset, params, lang } = props;
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  const expandedFilters = getSearchParams(params.searchParams);

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

  if (typeError(data)) {
    return { isError: true, error: data as IError, total: 0 };
  } else {
    return { isError: false, products: data.items, total: data.total };
  }
};
