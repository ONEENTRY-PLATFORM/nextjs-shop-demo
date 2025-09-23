import { toast } from 'react-toastify';

import { api } from '@/app/api';
import { handleApiError } from '@/app/utils/errorHandler';

/**
 * Subscribe events with Events API
 * @async
 * @param id product id
 * @see {@link https://doc.oneentry.cloud/docs/events OneEntry CMS docs}
 * @returns void
 */
export const onSubscribeEvents = async (id: number) => {
  try {
    // await api.Events.subscribeByMarker('catalog_event', id);
    const status = await api.Events.subscribeByMarker(
      'status_out_of_stock',
      id,
    );
    const price = await api.Events.subscribeByMarker('product_price', id);
    if (status) {
      toast('You unsubscribed from status updates for this product');
    }
    if (price) {
      toast('You unsubscribed from price updates for this product');
    }
  } catch (error) {
    const apiError = handleApiError(error);
    // eslint-disable-next-line no-console
    console.log('Error subscribing to events:', apiError.message);
  }
};

/**
 * Unsubscribe events with Events API
 * @async
 * @param id product id
 * @see {@link https://doc.oneentry.cloud/docs/events OneEntry CMS docs}
 * @returns void
 */
export const onUnsubscribeEvents = async (id: number) => {
  try {
    // await api.Events.unsubscribeByMarker('catalog_event', id);
    const status = await api.Events.unsubscribeByMarker(
      'status_out_of_stock',
      id,
    );
    const price = await api.Events.unsubscribeByMarker('product_price', id);
    if (status) {
      toast('You unsubscribed from status updates for this product');
    }
    if (price) {
      toast('You unsubscribed from price updates for this product');
    }
  } catch (error) {
    const apiError = handleApiError(error);
    // eslint-disable-next-line no-console
    console.log('Error unsubscribing from events:', apiError.message);
  }
};
