import type { IError } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

import { getApi } from '@/app/api';
import getSearchParams from '@/app/api/utils/getSearchParams';
import { LanguageEnum } from '@/app/types/enum';
import { isIError } from '@/app/utils/errorHandler';

/**
 * Get all products with pagination and filter.
 * @async
 * @param   {object}          props                                - Product parameters
 * @param   {number}          props.offset                         - Offset for pagination.
 * @param   {number}          props.limit                          - Limit for pagination.
 * @param   {string}          props.lang                           - Language shortcode.
 * @param   {object}          [props.params]                       - Search parameters.
 * @param   {string}          [props.params.handle]                - Product handle.
 * @param   {object}          [props.params.searchParams]          - Search parameters.
 * @param   {string}          [props.params.searchParams.search]   - Search query.
 * @param   {string}          [props.params.searchParams.in_stock] - Filter by in stock status.
 * @param   {string}          [props.params.searchParams.color]    - Filter by color.
 * @param   {string}          [props.params.searchParams.minPrice] - Filter by minimum price.
 * @param   {string}          [props.params.searchParams.maxPrice] - Filter by maximum price.
 * @returns {Promise<object>}                                      Array with ProductEntity objects
 * @see {@link https://doc.oneentry.cloud/docs/catalog OneEntry CMS docs}
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry SDK docs}
 */
export const getProducts = async (props: {
  offset: number;
  limit: number;
  lang: string;
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
  isError: boolean;
  error?: IError;
  products?: IProductsEntity[];
  total: number;
}> => {
  const { limit, offset, params, lang } = props;
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  const body = getSearchParams(params?.searchParams, params?.handle) || [];

  const data = await getApi().Products.getProducts(body, langCode, {
    limit,
    offset,
    sortOrder: 'ASC',
    sortKey: 'date',
  });

  if (isIError(data)) {
    return { isError: true, error: data, total: 0 };
  }

  return { isError: false, products: data.items, total: data.total };
};
