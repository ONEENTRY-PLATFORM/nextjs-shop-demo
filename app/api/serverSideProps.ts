import type { IAttributesSetsEntity } from 'oneentry/dist/attribute-sets/attributeSetsInterfaces';
import type { BlockType } from 'oneentry/dist/blocks/blocksInterfaces';
import type { ILocalEntity } from 'oneentry/dist/locales/localesInterfaces';
import type { IMenusEntity } from 'oneentry/dist/menus/menusInterfaces';
import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';
import type {
  IFilterParams,
  IProductsEntity,
} from 'oneentry/dist/products/productsInterfaces';

import { api } from '@/app/api';

const getSearchParams = (searchParams?: {
  search?: string;
  in_stock?: string;
  color?: string;
  minPrice?: string;
  maxPrice?: string;
}) => {
  const expandedFilters:
    | Array<IFilterParams & { statusMarker?: string }>
    | undefined = [];

  // check if product has SKU or this is service product
  const servicesFilter: IFilterParams = {
    attributeMarker: 'sku',
    conditionMarker: 'nin',
    conditionValue: null,
  };
  expandedFilters.push(servicesFilter);

  if (searchParams?.['in_stock']) {
    expandedFilters.push({
      statusMarker: 'in_stock',
      attributeMarker: 'price',
      conditionValue: null,
    });
  }

  if (searchParams?.color) {
    const newFilter: IFilterParams = {
      attributeMarker: 'color',
      conditionMarker: 'in',
      conditionValue: searchParams.color,
    };
    expandedFilters.push(newFilter);
  }

  if (searchParams?.minPrice) {
    const filter: IFilterParams = {
      attributeMarker: 'price',
      conditionMarker: 'mth',
      conditionValue: searchParams.minPrice,
      pageUrl: ['shop'],
    };
    expandedFilters.push(filter);
  }

  if (searchParams?.maxPrice) {
    const filter: IFilterParams = {
      attributeMarker: 'price',
      conditionMarker: 'lth',
      conditionValue: searchParams.maxPrice,
      pageUrl: ['shop'],
    };
    expandedFilters.push(filter);
  }

  return expandedFilters;
};

/* api.Products */

// getProducts
export async function getProducts(props: {
  limit: number;
  offset: number;
  langCode: string;
  params?: {
    handle?: string;
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
}> {
  const { limit, offset, params, langCode } = props;
  const searchValue = params?.searchParams?.search || '';
  const expandedFilters = getSearchParams(params?.searchParams);

  try {
    if (searchValue === '') {
      const data = await api.Products.getProducts(expandedFilters, langCode, {
        sortOrder: 'DESC',
        sortKey: 'id',
        offset: offset,
        limit: limit,
      });
      if (params?.handle) {
        return {
          isError: false,
          total: data.total,
          products: data.items.filter(
            (product: IProductsEntity) =>
              product.attributeValues.stickers?.value.value === params.handle,
          ),
        };
      }
      return {
        isError: false,
        products: data.items,
        total: data.total,
      };
    }
    if (searchValue) {
      const products = await api.Products.searchProduct(searchValue, 'en_US');
      return { isError: false, products: products, total: 100 };
    }
    return { isError: false, products: [], total: 0 };
  } catch (err) {
    return { isError: true, err: err };
  }
}

// getProductsByUrl
export async function getProductsByUrl(props: {
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
}> {
  const { limit, offset, params, langCode } = props;
  const expandedFilters = getSearchParams(params?.searchParams);

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
}

// getRelatedProductsById
export async function getRelatedProductsById(
  id: number,
  langCode: string,
): Promise<{
  products?: IProductsEntity[];
  total?: number;
  isError: boolean;
  err?: unknown;
}> {
  try {
    const data = await api.Products.getRelatedProductsById(id, langCode);
    return { isError: false, products: data.items, total: data.total };
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

// api.Blocks

// getBlocks
export async function getBlocks({
  type,
  langCode,
}: {
  type: BlockType;
  langCode: string;
}) {
  try {
    const blocks = await api.Blocks.getBlocks(type, langCode);
    return { isError: false, blocks: blocks };
  } catch (e) {
    return { isError: true, err: e };
  }
}

// getBlockByMarker
export async function getBlockByMarker({
  marker,
  langCode,
}: {
  marker: string;
  langCode: string;
}) {
  try {
    const block = await api.Blocks.getBlockByMarker(marker, langCode);
    return { isError: false, block: block };
  } catch (e) {
    return { isError: true, err: e };
  }
}

/* api.Pages */

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

// getChildPagesByParentUrl
export async function getChildPagesByParentUrl(
  url: string,
  langCode: string,
): Promise<{
  pages?: IPagesEntity[];
  isError: boolean;
  err?: unknown;
}> {
  try {
    const pages = await api.Pages.getChildPagesByParentUrl(url, langCode);
    return { isError: false, pages: pages };
  } catch (err) {
    return { isError: true, err: err };
  }
}

// getBlocksByPageUrl
export async function getBlocksByPageUrl({
  pageUrl,
  langCode,
}: {
  pageUrl: string;
  langCode: string;
}) {
  try {
    const blocks = await api.Pages.getBlocksByPageUrl(pageUrl, langCode);
    return { isError: false, blocks: blocks };
  } catch (e) {
    return { isError: true, err: e };
  }
}

// api.Menus

// getMenuByMarker
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

// api.AttributesSets

// getSingleAttributeByMarkerSet
export async function getSingleAttributeByMarkerSet({
  attributeMarker,
  setMarker,
  langCode,
}: {
  attributeMarker: string;
  setMarker: string;
  langCode: string;
}): Promise<{
  attribute?: IAttributesSetsEntity;
  isError: boolean;
  err?: unknown;
}> {
  try {
    const attribute = await api.AttributesSets.getSingleAttributeByMarkerSet(
      attributeMarker,
      setMarker,
      langCode,
    );
    return { isError: false, attribute: attribute };
  } catch (e) {
    return { isError: true, err: e };
  }
}

// api.Locales

// getLocales
export async function getLocales(): Promise<{
  locales?: ILocalEntity[];
  isError: boolean;
  err?: unknown;
}> {
  try {
    const locales = await api.Locales.getLocales();
    return { isError: false, locales: locales };
  } catch (e) {
    return { isError: true, err: e };
  }
}

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
