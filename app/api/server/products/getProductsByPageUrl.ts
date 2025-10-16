import type { IError } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

import { api } from '@/app/api';
import getSearchParams from '@/app/api/utils/getSearchParams';
import { LanguageEnum } from '@/app/types/enum';
import { handleApiError, isIError } from '@/app/utils/errorHandler';

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
  /** Destructure props to get limit, offset, params, and lang */
  const { limit, offset, params, lang } = props;
  /** Get language code from LanguageEnum */
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  /** Prepare search parameters body for the API request */
  const body = getSearchParams(params.searchParams);

  /** Fetch products by page URL with pagination and search parameters from the API */
  try {
    /** Call the API to get products by page URL with filters, pagination, and sorting */
    const data = await api.Products.getProductsByPageUrl(
      params.handle,
      body,
      langCode,
      {
        sortOrder: 'DESC',
        sortKey: 'date',
        offset: offset,
        limit: limit,
      },
    );

    /** Check if the response is an error */
    if (isIError(data)) {
      return { isError: true, error: data, products: [], total: 0 };
    } else {
      return {
        isError: false,
        error: {} as IError,
        products: data.items,
        total: data.total,
      };
    }
  } catch (error) {
    /** Handle API errors */
    const apiError = handleApiError('getProductsByPageUrl', error);
    /** Return error response with empty products array and zero total */
    return {
      isError: true,
      error: {
        statusCode: apiError.statusCode,
        message: apiError.message,
      } as IError,
      products: [],
      total: 0,
    };
  }
};
