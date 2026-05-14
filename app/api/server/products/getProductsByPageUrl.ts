import type { IError } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

import { getApi } from '@/app/api';
import getSearchParams from '@/app/api/utils/getSearchParams';
import { toLangCode } from '@/app/types/enum';
import { isIError } from '@/app/utils/errorHandler';

/**
 * Get all products with pagination for the selected category.
 * @async
 * @param   {object}          props                              - Object containing the language, offset, limit, and parameters.
 * @param   {string}          props.lang                         - Language shortcode.
 * @param   {number}          props.offset                       - Offset for pagination.
 * @param   {number}          props.limit                        - Limit for pagination.
 * @param   {object}          props.params                       - Parameters for filtering products.
 * @param   {string}          props.params.handle                - Category handle.
 * @param   {object}          props.params.searchParams          - Search parameters.
 * @param   {string}          props.params.searchParams.search   - Search query.
 * @param   {string}          props.params.searchParams.in_stock - Filter by in stock status.
 * @param   {string}          props.params.searchParams.color    - Filter by color.
 * @param   {string}          props.params.searchParams.minPrice - Filter by minimum price.
 * @param   {string}          props.params.searchParams.maxPrice - Filter by maximum price.
 * @returns {Promise<object>}                                    Array with ProductEntity objects
 * @see {@link https://doc.oneentry.cloud/docs/catalog OneEntry CMS docs}
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry SDK docs}
 */
export const getProductsByPageUrl = async (props: {
  lang: string;
  offset: number;
  limit: number;
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
  isError: boolean;
  error: IError;
  products: IProductsEntity[] | [];
  total: number;
}> => {
  const { limit, offset, params, lang } = props;
  const langCode = toLangCode(lang);
  const body = getSearchParams(params.searchParams);

  const data = await getApi().Products.getProductsByPageUrl(
    params.handle,
    body,
    langCode,
    { sortOrder: 'DESC', sortKey: 'date', offset, limit },
  );

  if (isIError(data)) {
    return { isError: true, error: data, products: [], total: 0 };
  }

  return {
    isError: false,
    error: {} as IError,
    products: data.items,
    total: data.total,
  };
};
