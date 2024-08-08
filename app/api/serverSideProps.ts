import type { IFilterParams } from 'oneentry/dist/products/productsInterfaces';

import { api } from './';

// getMenusByMarker
export async function getMenusByMarker(marker: string, activeLanguage: string) {
  const menu = await api.Menus.getMenusByMarker(marker, activeLanguage);
  return menu;
}

// getProducts
export async function getProducts({ limit = 10, offset = 0 }) {
  const expandedFilters: IFilterParams[] | undefined = [];

  try {
    const products = await api.Products.getProducts(expandedFilters, 'en_US', {
      sortOrder: 'DESC',
      sortKey: 'id',
      offset: offset,
      limit: limit,
    });
    return { products };
  } catch (err) {
    return err;
  }
}

// getProductById
export async function getProductById(id: number, langCode: string) {
  try {
    return await api.Products.getProductById(id, langCode).then((res) => res);
  } catch (err) {
    return err;
  }
}

// getPages
export async function getPages(langCode: string) {
  try {
    return await api.Pages.getPages(langCode).then((res) => res);
  } catch (err) {
    return err;
  }
}

// getPageById
export async function getPageById(id: number, langCode: string) {
  try {
    return await api.Pages.getPageById(id, langCode).then((res) => res);
  } catch (err) {
    return err;
  }
}

// getPageByUrl
export async function getPageByUrl(url: string, langCode: string) {
  try {
    const pages = await api.Pages.getPageByUrl(url, langCode);
    return pages;
  } catch (err) {
    return err;
  }
}

// api.Products.getProductsByPageId
// api.Products.getProductsEmptyPage(langCode?: string, userQuery?: IProductsQuery): Promise<Array<IProductsEntity>>;
// getRelatedProductsById(id: number, langCode?: string, userQuery?: IProductsQuery);
// getProductById(id: number, langCode?: string);
// getProductBlockById(id: number)
// searchProduct(name: string, langCode?: string)
