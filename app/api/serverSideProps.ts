// import type { IAttributes } from 'oneentry/dist/base/utils';
import type { IAttributesSetsEntity } from 'oneentry/dist/attribute-sets/attributeSetsInterfaces';
import type {
  BlockType,
  // IBlockEntity,
} from 'oneentry/dist/blocks/blocksInterfaces';
// import type { IMenusEntity } from 'oneentry/dist/menus/menusInterfaces';
import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';
import type {
  IFilterParams,
  IProductsEntity,
} from 'oneentry/dist/products/productsInterfaces';

import { api } from '@/app/api';

/* ProductApi */
const setSearchParams = (searchParams?: {
  search?: string;
  in_stock?: string;
  color?: string;
  minPrice?: string;
  maxPrice?: string;
}) => {
  const expandedFilters:
    | Array<IFilterParams & { statusMarker?: string }>
    | undefined = [];

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
      pageUrl: ['shop'],
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

// getProducts
export async function getProducts(props: {
  limit: number;
  offset: number;
  params?: {
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
  isError: boolean;
  err?: unknown;
}> {
  const { limit, offset, params } = props;
  const searchValue = params?.searchParams?.search || '';
  const expandedFilters = setSearchParams(params?.searchParams);

  try {
    if (searchValue === '') {
      const products = await api.Products.getProducts(
        expandedFilters,
        'en_US',
        {
          sortOrder: 'DESC',
          sortKey: 'id',
          offset: offset,
          limit: limit,
        },
      );
      return { isError: false, products: products };
    }
    if (searchValue) {
      const products = await api.Products.searchProduct(searchValue, 'en_US');
      return { isError: false, products: products };
    }
    return { isError: false, products: [] };
  } catch (err) {
    return { isError: true, err: err };
  }
}

// getProductsByUrl
export async function getProductsByUrl(props: {
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
  isError: boolean;
  err?: unknown;
}> {
  const { limit, offset, params } = props;
  const expandedFilters = setSearchParams(params?.searchParams);

  try {
    const products = await api.Products.getProductsByPageUrl(
      params.handle,
      expandedFilters,
      'en_US',
      {
        sortOrder: 'DESC',
        sortKey: 'id',
        offset: offset,
        limit: limit,
      },
    );
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

// getSimilarProducts
export async function getSimilarProducts(
  marker: string,
  langCode: string,
): Promise<{
  products?: IProductsEntity[];
  isError: boolean;
  err?: unknown;
}> {
  try {
    const products = await api.Blocks.getSimilarProducts(marker, langCode);
    return { isError: false, products: products };
  } catch (err) {
    return { isError: true, err };
  }
}

// getSimilarProducts
export async function getProductsByBlockMarker(
  marker: string,
  langCode: string,
): Promise<{
  products?: IProductsEntity[];
  isError: boolean;
  err?: unknown;
}> {
  try {
    const products = await api.Blocks.getProductsByBlockMarker(
      marker,
      langCode,
    );
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
}) {
  try {
    const menu = await api.Menus.getMenusByMarker(marker, langCode);
    return { isError: false, menu: menu };
  } catch (e) {
    return { isError: true, err: e };
  }
}

// getAttributeByMarker
export async function getAttributeByMarker({
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

// api.Products.getProductsByPageId
// api.Products.getProductsEmptyPage(langCode?: string, userQuery?: IProductsQuery): Promise<Array<IProductsEntity>>;

// api.Products.getProductBlockById(id: number)

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
