import type { IError } from 'oneentry/dist/base/utils';
import type { IOrderByMarkerEntity } from 'oneentry/dist/orders/ordersInterfaces';

import { api } from '@/app/api';
import { getCachedData, setCachedData } from '@/app/api/utils/cache';
import { handleApiError, isIError } from '@/app/utils/errorHandler';

interface HandleProps {
  marker: string;
  offset: number;
  limit: number;
  lang: string;
}
/**
 * Getting all orders from the orders storage object created by the user
 * @async
 * @description This method requires user authorization. For more information about configuring the authorization module, see the documentation in the configuration settings section of the SDK.
 * @param marker The text identifier of the order storage object
 * @param lang Current language shortcode
 * @param offset Offset parameter. Default 0
 * @param limit Limit parameter. Default 30
 * @see {@link https://doc.oneentry.cloud/docs/orders OneEntry CMS docs}
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry SDK docs}
 *
 * @returns All user orders
 */
export const getAllOrdersByMarker = async ({
  marker,
  offset,
  limit,
  lang,
}: HandleProps): Promise<{
  isError: boolean;
  error?: IError;
  orders?: IOrderByMarkerEntity[];
  total: number;
}> => {
  const langCode = lang.toUpperCase();
  const cacheKey = `orders-${marker}-${offset}-${limit}-${langCode}`;

  // Check cache first
  const cached = getCachedData<{
    orders: IOrderByMarkerEntity[];
    total: number;
  }>(cacheKey);
  if (cached) {
    return {
      isError: false,
      orders: cached.orders,
      total: cached.total,
    };
  }

  try {
    const data = await api.Orders.getAllOrdersByMarker(
      marker,
      langCode,
      offset,
      limit,
    );

    if (isIError(data)) {
      return { isError: true, error: data, total: 0 };
    } else {
      // Cache the result
      setCachedData<{ orders: IOrderByMarkerEntity[]; total: number }>(
        cacheKey,
        {
          orders: data.items,
          total: data.total,
        },
      );
      return { isError: false, orders: data.items, total: data.total };
    }
  } catch (error) {
    const apiError = handleApiError(error);
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
