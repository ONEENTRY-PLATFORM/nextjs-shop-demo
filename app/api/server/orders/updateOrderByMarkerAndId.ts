import type {
  IBaseOrdersEntity,
  IOrderData,
} from 'oneentry/dist/orders/ordersInterfaces';

import { api } from '@/app/api';

export const updateOrderByMarkerAndId = async (
  marker: string,
  id: number,
  data: IOrderData,
): Promise<{
  order?: IBaseOrdersEntity;
  isError: boolean;
  err?: unknown;
}> => {
  try {
    const order = await api.Orders.updateOrderByMarkerAndId(marker, id, data);
    return { isError: false, order: order };
  } catch (e) {
    return { isError: true, err: e };
  }
};
