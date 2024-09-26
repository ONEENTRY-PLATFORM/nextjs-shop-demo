import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

import { api } from '@/app/api';
import getSearchParams from '@/app/api/utils/getSearchParams';

export const getProductsByPageUrl = async (props: {
  langCode: string;
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
  total?: number;
  isError: boolean;
  err?: unknown;
}> => {
  const { limit, offset, params, langCode } = props;
  const { searchParams } = params;
  const expandedFilters = getSearchParams(searchParams);

  try {
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
  } catch (err) {
    return { isError: true, err: err };
  }
};
