// import type { IAttributes } from 'oneentry/dist/base/utils';
import type { IMenusEntity } from 'oneentry/dist/menus/menusInterfaces';
import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';
import type {
  IFilterParams,
  IProductsEntity,
} from 'oneentry/dist/products/productsInterfaces';

import { api } from './';

/* ProductApi */

// getProducts
export async function getProducts(props: {
  limit: number;
  offset: number;
  params: object;
}): Promise<{
  products?: IProductsEntity[];
  isError: boolean;
  err?: unknown;
}> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { limit, offset, params } = props;
  const expandedFilters: IFilterParams[] | undefined = [];

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

// getRelatedProductsById
export async function getRelatedProductsById(
  id: number,
  langCode: string,
): Promise<{
  products?: IProductsEntity[];
  isError: boolean;
  err?: unknown;
}> {
  try {
    const products = await api.Products.getRelatedProductsById(id, langCode);
    return { isError: false, products: products };
  } catch (err) {
    return { isError: true, err };
  }
}

// getProductById
export async function getProductById(
  id: number,
  langCode: string,
): Promise<{
  product?: IProductsEntity;
  isError: boolean;
  err?: unknown;
}> {
  try {
    const product = await api.Products.getProductById(id, langCode);
    return { isError: false, product: product };
  } catch (err) {
    return { isError: true, err };
  }
}

/* PageApi */

// getPages
export async function getPages(langCode: string): Promise<{
  pages?: IPagesEntity[];
  isError: boolean;
  err?: unknown;
}> {
  try {
    const pages = await api.Pages.getPages(langCode);
    return { isError: false, pages: pages };
  } catch (e) {
    return { isError: true, err: e };
  }
}

// getPageById
export async function getPageById(
  id: number,
  langCode: string,
): Promise<{
  page?: IPagesEntity;
  isError: boolean;
  err?: unknown;
}> {
  try {
    const page = await api.Pages.getPageById(id, langCode);
    return { isError: false, page: page };
  } catch (err) {
    return { isError: true, err: err };
  }
}

// getPageByUrl
export async function getPageByUrl(
  url: string,
  langCode: string,
): Promise<{
  page?: IPagesEntity;
  isError: boolean;
  err?: unknown;
}> {
  try {
    const page = await api.Pages.getPageByUrl(url, langCode);
    return { isError: false, page: page };
  } catch (err) {
    return { isError: true, err: err };
  }
}

/* MenusApi */

// getMenuByMarker - user_web, main_web
export async function getMenuByMarker({
  marker,
  langCode,
}: {
  marker: string;
  langCode: string;
}): Promise<{
  menu?: IMenusEntity;
  isError: boolean;
  err?: unknown;
}> {
  try {
    const menu = await api.Menus.getMenusByMarker(marker, langCode);
    return { isError: false, menu: menu };
  } catch (e) {
    return { isError: true, err: e };
  }
}

// api.Products.getProductsByPageId
// api.Products.getProductsEmptyPage(langCode?: string, userQuery?: IProductsQuery): Promise<Array<IProductsEntity>>;
// getRelatedProductsById(id: number, langCode?: string, userQuery?: IProductsQuery);
// getProductById(id: number, langCode?: string);
// getProductBlockById(id: number)
// searchProduct(name: string, langCode?: string)

// interface IDefineApi {
//   Admins: AdminsApi;
//   AttributesSets: AttributesSetsApi;
//   AuthProvider: AuthProviderApi;
//   Blocks: BlocksApi;
//   Events: EventsApi;
//   FileUploading: FileUploadingApi;
//   Forms: FormsApi;
//   FormData: FormsDataApi;
//   GeneralTypes: GeneralTypesApi;
//   Locales: LocalesApi;
//   Orders: OrdersApi;
//   Payments: PaymentsApi;
//   ProductStatuses: ProductStatusesApi;
//   System: SystemApi;
//   Templates: TemplatesApi;
//   TemplatePreviews: TemplatePreviewsApi;
//   Users: UsersApi;
// }
