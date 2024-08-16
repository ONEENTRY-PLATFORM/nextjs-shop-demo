import type { IAttributes } from 'oneentry/dist/base/utils';
import type { IFormsEntity } from 'oneentry/dist/forms/formsInterfaces';
import type { IMenusEntity } from 'oneentry/dist/menus/menusInterfaces';
import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { limit, offset, params } = props;
  const expandedFilters: IFilterParams[] | undefined = [];
  // console.log(params);

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
  isError: boolean;
  products?: IProductsEntity[];
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
export async function getPageByUrl(
  url: string,
  langCode: string,
): Promise<{
  isError: boolean;
  page?: IPagesEntity;
  err?: unknown;
}> {
  try {
    const page = await api.Pages.getPageByUrl(url, langCode);
    return { isError: false, page: page };
  } catch (err) {
    return { isError: true, err: err };
  }
}

// getMenuByMarker
export async function getMenuByMarker({
  marker,
  langCode,
}: {
  marker: string;
  langCode: string;
}) {
  try {
    const page = await api.Menus.getMenusByMarker(marker, langCode);
    return { isError: false, page: page };
  } catch (err) {
    return { isError: true, err: err };
  }
}

// getFormByMarker
export async function getFormByMarker({
  marker,
  langCode,
}: {
  marker: string;
  langCode: string;
}) {
  const notEditableTypes: { [key: string]: unknown } = {
    button: false,
    spam: false,
    null: true,
  };

  try {
    const form = await api.Forms.getFormByMarker(marker, langCode);
    form.attributes = (form.attributes as IAttributes[]).sort((a, b) => {
      return a.position - b.position;
    });
    const initValue: {
      [p: string]: {
        value: string;
        valid: boolean;
        required: boolean;
      };
    } = {};
    const reduced = (form?.attributes as IAttributes[]).reduce(
      (obj, currentValue) => {
        if (notEditableTypes[currentValue.type] === false) {
          return obj;
        }
        // eslint-disable-next-line no-param-reassign
        obj[currentValue.marker] = {
          value: '',
          valid: false,
          required: currentValue?.validators?.requiredValidator?.strict,
        };
        return obj;
      },
      initValue,
    );
    return { isError: false, form: reduced };
  } catch (e) {
    console.log(e);
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
//   Menus: MenusApi;
//   Orders: OrdersApi;
//   Pages: PageApi;
//   Payments: PaymentsApi;
//   Products: ProductApi;
//   ProductStatuses: ProductStatusesApi;
//   System: SystemApi;
//   Templates: TemplatesApi;
//   TemplatePreviews: TemplatePreviewsApi;
//   Users: UsersApi;
// }
