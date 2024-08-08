import type { IFilterParams } from 'oneentry/dist/products/productsInterfaces';

import { api } from './';

// api.Products
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

export async function getProductById(id: number, langCode: string) {
  return await api.Products.getProductById(id, langCode).then((res) => res);
}

// api.Pages
export async function getPages(langCode: string) {
  return await api.Pages.getPages(langCode).then((res) => res);
}

export async function getPageById(id: number, langCode: string) {
  return await api.Pages.getPageById(id, langCode).then((res) => res);
}

export async function getPageByUrl(url: string, langCode: string) {
  return await api.Pages.getPageByUrl(url, langCode).then((res) => res);
}

// api.Products.getProductsByPageId
// api.Products.getProductsEmptyPage(langCode?: string, userQuery?: IProductsQuery): Promise<Array<IProductsEntity>>;
// getRelatedProductsById(id: number, langCode?: string, userQuery?: IProductsQuery);
// getProductById(id: number, langCode?: string);
// getProductBlockById(id: number)
// searchProduct(name: string, langCode?: string)
