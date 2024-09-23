import type { IAttributesSetsEntity } from 'oneentry/dist/attribute-sets/attributeSetsInterfaces';
import type { BlockType } from 'oneentry/dist/blocks/blocksInterfaces';
import type { ILocalEntity } from 'oneentry/dist/locales/localesInterfaces';
import type { IMenusEntity } from 'oneentry/dist/menus/menusInterfaces';
import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';

import { api } from '@/app/api';

// const getSearchParams = (
//   searchParams?: {
//     search?: string;
//     in_stock?: string;
//     color?: string;
//     minPrice?: string;
//     maxPrice?: string;
//   },
//   handle?: string,
// ) => {
//   const expandedFilters:
//     | Array<IFilterParams & { statusMarker?: string }>
//     | undefined = [];

//   // check if product has SKU or this is service product
//   const servicesFilter: IFilterParams = {
//     attributeMarker: 'sku',
//     conditionMarker: 'nin',
//     conditionValue: null,
//   };
//   expandedFilters.push(servicesFilter);

//   if (handle) {
//     const stickersFilter: IFilterParams = {
//       attributeMarker: 'stickers',
//       conditionMarker: 'in',
//       conditionValue: handle,
//     };
//     expandedFilters.push(stickersFilter);
//   }

//   if (searchParams?.['in_stock']) {
//     expandedFilters.push({
//       statusMarker: 'in_stock',
//       attributeMarker: 'price',
//       conditionValue: null,
//     });
//   }

//   if (searchParams?.color) {
//     const newFilter: IFilterParams = {
//       attributeMarker: 'color',
//       conditionMarker: 'in',
//       conditionValue: searchParams.color,
//     };
//     expandedFilters.push(newFilter);
//   }

//   if (searchParams?.minPrice) {
//     const filter: IFilterParams = {
//       attributeMarker: 'price',
//       conditionMarker: 'mth',
//       conditionValue: searchParams.minPrice,
//       pageUrl: ['shop'],
//     };
//     expandedFilters.push(filter);
//   }

//   if (searchParams?.maxPrice) {
//     const filter: IFilterParams = {
//       attributeMarker: 'price',
//       conditionMarker: 'lth',
//       conditionValue: searchParams.maxPrice,
//       pageUrl: ['shop'],
//     };
//     expandedFilters.push(filter);
//   }

//   return expandedFilters;
// };

/* api.Products */

// getProducts
// getProductsByUrl
// getRelatedProductsById
// getProductById

// api.Blocks

// getBlocks

// getBlockByMarker

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
// getPageByUrl
// getChildPagesByParentUrl
// getBlocksByPageUrl

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
