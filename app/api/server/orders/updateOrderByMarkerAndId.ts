import type { IError } from 'oneentry/dist/base/utils';
import type {
  IBaseOrdersEntity,
  IOrderData,
} from 'oneentry/dist/orders/ordersInterfaces';

import { api } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';
import { typeError } from '@/components/utils';

export const updateOrderByMarkerAndId = async (
  marker: string,
  id: number,
  data: IOrderData,
  lang?: string,
): Promise<{
  isError: boolean;
  error?: IError;
  order?: IBaseOrdersEntity;
}> => {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  const orderData = await api.Orders.updateOrderByMarkerAndId(
    marker,
    id,
    data,
    langCode,
  );

  if (typeError(orderData)) {
    return { isError: true, error: orderData };
  } else {
    return { isError: false, order: orderData };
  }
};
