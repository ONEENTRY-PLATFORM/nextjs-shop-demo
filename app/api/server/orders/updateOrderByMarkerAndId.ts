import type { IError } from 'oneentry/dist/base/utils';
import type {
  IBaseOrdersEntity,
  IOrderData,
} from 'oneentry/dist/orders/ordersInterfaces';

import { api } from '@/app/api';
import { clearAllCache } from '@/app/api/utils/cache';
import { LanguageEnum } from '@/app/types/enum';
import { handleApiError, isIError } from '@/app/utils/errorHandler';

interface HandleProps {
  marker: string;
  id: number;
  data: IOrderData;
  lang?: string;
}

/**
 * Getting all orders from the orders storage object created by the user
 * @async
 * @description This method requires user authorization. For more information about configuring the authorization module, see the documentation in the configuration settings section of the SDK.
 * @param marker The text identifier of the order storage object
 * @param id ID of the order object
 * @param data Object for updating an order
 * @param lang Current language shortcode
 * @see {@link https://doc.oneentry.cloud/docs/orders OneEntry CMS docs}
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry SDK docs}
 *
 * @returns Promise
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
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];

  // For update operations, we should clear the cache to ensure data consistency
  clearAllCache();

  try {
    const orderData = await api.Orders.updateOrderByMarkerAndId(
      marker,
      id,
      data,
      langCode,
    );

    if (isIError(orderData)) {
      return { isError: true, error: orderData };
    } else {
      return { isError: false, order: orderData };
    }
  } catch (error) {
    const apiError = handleApiError(error);
    return {
      isError: true,
      error: {
        statusCode: apiError.statusCode,
        message: apiError.message,
      } as IError,
    };
  }
};
