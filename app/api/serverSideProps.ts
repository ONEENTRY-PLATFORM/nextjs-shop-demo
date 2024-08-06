import type { IFilterParams } from 'oneentry/dist/products/productsInterfaces';

import { api } from './';

export async function getPages(activeLanguage: string) {
  const result = await api.Pages.getPages(activeLanguage);

  return result;
}

export async function getProducts({ limit = 10, offset = 0 }) {
  const expandedFilters: IFilterParams[] | undefined = [];

  const products = await api.Products.getProducts(expandedFilters, 'en_US', {
    sortOrder: 'DESC',
    sortKey: 'id',
    offset: offset,
    limit: limit,
  });

  return { products };
}

// api.Products.getProductsByPageId
// api.Products.getProductsEmptyPage(langCode?: string, userQuery?: IProductsQuery): Promise<Array<IProductsEntity>>;
