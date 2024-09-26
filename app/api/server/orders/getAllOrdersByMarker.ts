import type { IOrderByMarkerEntity } from 'oneentry/dist/orders/ordersInterfaces';

import { api } from '@/app/api';

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
  total?: number;
  isError?: boolean;
  error?: unknown;
}> => {
  try {
    const data = await api.Orders.getAllOrdersByMarker(
      marker,
      langCode,
      limit,
      offset,
    );
    return { orders: data.items, total: data.total };
  } catch (e) {
    return { isError: true, error: e };
  }
};
