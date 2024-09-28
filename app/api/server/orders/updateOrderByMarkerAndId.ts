import type {
  IBaseOrdersEntity,
  IOrderData,
} from 'oneentry/dist/orders/ordersInterfaces';

import { api } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';

export const updateOrderByMarkerAndId = async (
  marker: string,
  id: number,
  data: IOrderData,
  lang?: string,
): Promise<{
  order?: IBaseOrdersEntity;
  isError: boolean;
  err?: unknown;
}> => {
  try {
    const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
    const order = await api.Orders.updateOrderByMarkerAndId(
      marker,
      id,
      data,
      langCode,
    );
    return { isError: false, order: order };
  } catch (e) {
    return { isError: true, err: e };
  }
};
