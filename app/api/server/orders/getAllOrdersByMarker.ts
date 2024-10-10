import type { IOrderByMarkerEntity } from 'oneentry/dist/orders/ordersInterfaces';

import { api } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';

export const getAllOrdersByMarker = async ({
  marker,
  limit,
  offset,
  lang,
}: {
  marker: string;
  limit: number;
  offset: number;
  lang: string;
}): Promise<{
  isError: boolean;
  orders?: IOrderByMarkerEntity[];
  total?: number;
}> => {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  const data = await api.Orders.getAllOrdersByMarker(
    marker,
    langCode,
    limit,
    offset,
  );
  return { isError: false, orders: data.items, total: data.total };
};
