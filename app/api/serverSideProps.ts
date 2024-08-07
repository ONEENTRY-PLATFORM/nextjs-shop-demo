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

export async function getProductById({ id = 0, langCode = 'en_US' }) {
  // getProductById(id: number, langCode?: string);
  const product = await api.Products.getProductById(id, langCode).then(
    (res) => res,
  );

  return product;
}

// api.Products.getProductsByPageId
// api.Products.getProductsEmptyPage(langCode?: string, userQuery?: IProductsQuery): Promise<Array<IProductsEntity>>;
// getRelatedProductsById(id: number, langCode?: string, userQuery?: IProductsQuery);
// getProductById(id: number, langCode?: string);
// getProductBlockById(id: number)
// searchProduct(name: string, langCode?: string)
