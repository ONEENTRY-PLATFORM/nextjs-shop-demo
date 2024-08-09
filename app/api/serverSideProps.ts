import type {
  IFilterParams,
  IProductsEntity,
} from 'oneentry/dist/products/productsInterfaces';

import { api } from './';

// getMenusByMarker
export async function getMenusByMarker(marker: string, activeLanguage: string) {
  try {
    const menu = await api.Menus.getMenusByMarker(marker, activeLanguage);
    return { isError: false, menu: menu };
  } catch (err) {
    return { isError: true, products: err };
  }
}

// getProducts
export async function getProducts(props: {
  limit: number;
  offset: number;
  params: object;
}): Promise<{
  isError: boolean;
  products?: IProductsEntity[];
  err?: unknown;
}> {
  const { limit, offset, params } = props;
  const expandedFilters: IFilterParams[] | undefined = [];
  console.log(params);

  try {
    const products = await api.Products.getProducts(expandedFilters, 'en_US', {
      sortOrder: 'DESC',
      sortKey: 'id',
      offset: offset,
      limit: limit,
    });
    return { isError: false, products: products };
  } catch (err) {
    return { isError: true, err: err };
  }
}

// getProductById
export async function getProductById(
  id: number,
  langCode: string,
): Promise<{
  isError: boolean;
  product?: IProductsEntity;
  err?: unknown;
}> {
  try {
    const product = await api.Products.getProductById(id, langCode);
    return { isError: false, product: product };
  } catch (err) {
    return { isError: true, err };
  }
}

// getPages
export async function getPages(langCode: string) {
  try {
    const page = await api.Pages.getPages(langCode);
    return { isError: false, page: page };
  } catch (err) {
    return { isError: true, page: err };
  }
}

// getPageById
export async function getPageById(id: number, langCode: string) {
  try {
    const page = api.Pages.getPageById(id, langCode);
    return { isError: false, page };
  } catch (err) {
    return { isError: true, page: err };
  }
}

// getPageByUrl
export async function getPageByUrl(url: string, langCode: string) {
  try {
    const page = await api.Pages.getPageByUrl(url, langCode);
    return { isError: false, page };
  } catch (err) {
    return { isError: true, page: err };
  }
}

// api.Products.getProductsByPageId
// api.Products.getProductsEmptyPage(langCode?: string, userQuery?: IProductsQuery): Promise<Array<IProductsEntity>>;
// getRelatedProductsById(id: number, langCode?: string, userQuery?: IProductsQuery);
// getProductById(id: number, langCode?: string);
// getProductBlockById(id: number)
// searchProduct(name: string, langCode?: string)
