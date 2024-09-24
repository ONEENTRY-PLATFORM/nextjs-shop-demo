import type { IOrderByMarkerEntity } from 'oneentry/dist/orders/ordersInterfaces';

import { api } from '../api/api';

export const getAllOrdersByMarker = async ({
  marker,
  limit,
  offset,
  langCode,
}: {
  marker: string;
  limit: number;
  offset: number;
  langCode: string;
}): Promise<{
  orders?: IOrderByMarkerEntity[];
  isError: boolean;
  err?: unknown;
}> => {
  try {
    const data = await api.Orders.getAllOrdersByMarker(
      marker,
      langCode,
      limit || 10,
      offset || 0,
    );
    return { isError: false, orders: data.items };
  } catch (e) {
    return { isError: true, err: e };
  }
};
