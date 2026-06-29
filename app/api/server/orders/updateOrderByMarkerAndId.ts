import type { IError } from 'oneentry/dist/base/utils';
import type {
  IBaseOrdersEntity,
  IOrderData,
} from 'oneentry/dist/orders/ordersInterfaces';

import { getApi, isError } from '@/app/api';
import { toLangCode } from '@/app/types/enum';

interface HandleProps {
  marker: string;
  id: number;
  data: IOrderData;
  lang?: string;
}

/**
 * Getting all orders from the orders storage object created by the user
 * @async
 * @param   {object}          props        - Object for updating an order.
 * @param   {string}          props.marker - The text identifier of the order storage object.
 * @param   {number}          props.id     - ID of the order object.
 * @param   {IOrderData}      props.data   - Object for updating an order.
 * @param   {string}          props.lang   - Current language shortcode.
 * @description This method requires user authorization. For more information about configuring the authorization module, see the documentation in the configuration settings section of the SDK.
 * @returns {Promise<object>}              Promise
 * @see {@link https://doc.oneentry.cloud/docs/orders OneEntry CMS docs}
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry SDK docs}
 */
export const updateOrderByMarkerAndId = async ({
  marker,
  id,
  data,
  lang,
}: HandleProps): Promise<{
  isError: boolean;
  error?: IError;
  order?: IBaseOrdersEntity;
}> => {
  const langCode = toLangCode(lang ?? '');

  const orderData = await getApi().Orders.updateOrderByMarkerAndId(
    marker,
    id,
    data,
    langCode,
  );

  if (isError(orderData)) {
    return { isError: true, error: orderData };
  }

  return { isError: false, order: orderData };
};
