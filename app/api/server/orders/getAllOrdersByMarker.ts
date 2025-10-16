import type { IError } from 'oneentry/dist/base/utils';
import type { IOrderByMarkerEntity } from 'oneentry/dist/orders/ordersInterfaces';

import { api } from '@/app/api';
import { handleApiError, isIError } from '@/app/utils/errorHandler';

/**
 * Getting all orders from the orders storage object created by the user.
 * @description This method requires user authorization. For more information about configuring the authorization module, see the documentation in the configuration settings section of the SDK.
 * @async
 * @param   {object}          props        - The object containing the parameters.
 * @param   {string}          props.marker - The text identifier of the order storage object.
 * @param   {number}          props.lang   - Current language shortcode.
 * @param   {number}          props.offset - Offset parameter. Default 0.
 * @param   {string}          props.limit  - Limit parameter. Default 30.
 * @returns {Promise<object>}              All user orders.
 * @see {@link https://doc.oneentry.cloud/docs/orders OneEntry CMS docs}
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry SDK docs}
 */
export const getAllOrdersByMarker = async ({
  marker,
  offset,
  limit,
  lang,
}: {
  marker: string;
  offset: number;
  limit: number;
  lang: string;
}): Promise<{
  isError: boolean;
  error?: IError;
  orders?: IOrderByMarkerEntity[];
  total: number;
}> => {
  /** Convert language code to uppercase */
  const langCode = lang.toUpperCase();

  /** Fetch orders by marker with pagination from the API */
  try {
    /** Call the API to get orders by marker with offset and limit */
    const data = await api.Orders.getAllOrdersByMarker(
      marker,
      langCode,
      offset,
      limit,
    );

    /** Check if the response is an error */
    if (isIError(data)) {
      return { isError: true, error: data, total: 0 };
    } else {
      return { isError: false, orders: data.items, total: data.total };
    }
  } catch (error) {
    /** Handle API errors */
    const apiError = handleApiError('getAllOrdersByMarker', error);

    /** Return error response with zero total */
    return {
      isError: true,
      error: {
        statusCode: apiError.statusCode,
        message: apiError.message,
      } as IError,
      total: 0,
    };
  }
};
