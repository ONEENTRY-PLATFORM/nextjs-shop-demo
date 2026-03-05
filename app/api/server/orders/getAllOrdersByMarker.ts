import type { IError } from 'oneentry/dist/base/utils';
import type { IOrderByMarkerEntity } from 'oneentry/dist/orders/ordersInterfaces';

import { getApi } from '@/app/api';
import { isIError } from '@/app/utils/errorHandler';

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
  const langCode = lang.toUpperCase();

  const data = await getApi().Orders.getAllOrdersByMarker(
    marker,
    langCode,
    offset,
    limit,
  );

  if (isIError(data)) {
    return { isError: true, error: data, total: 0 };
  }

  return { isError: false, orders: data.items, total: data.total };
};
