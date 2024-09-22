import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

import { api } from '../api/api';
import getSearchParams from '../utils/getSearchParams';

export const getProductsByPageUrl = async (props: {
  offset: number;
  limit: number;
  langCode: string;
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
  const { searchParams, handle } = params;
  const expandedFilters = getSearchParams(searchParams, handle);

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
