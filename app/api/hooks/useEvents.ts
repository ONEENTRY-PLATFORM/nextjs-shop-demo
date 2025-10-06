import { toast } from 'react-toastify';

import { api } from '@/app/api';
import { handleApiError } from '@/app/utils/errorHandler';

/**
 * Subscribe events with Events API
 * @async
 * @param   {number}        id - product id
 * @returns {Promise<void>}    Promise that resolves when subscription is complete
 * @see {@link https://doc.oneentry.cloud/docs/events OneEntry CMS docs}
 */
export const onSubscribeEvents = async (id: number): Promise<void> => {
  try {
    const status = await api.Events.subscribeByMarker(
      'status_out_of_stock',
      id,
    );
    const price = await api.Events.subscribeByMarker('product_price', id);
    if (status) {
      toast('You subscribed to status updates for this product');
    }
    if (price) {
      toast('You subscribed to price updates for this product');
    }
  } catch (error) {
    const apiError = handleApiError('onSubscribeEvents', error);
    // eslint-disable-next-line no-console
    console.log('Error subscribing to events:', apiError.message);
  }
};

/**
 * Unsubscribe events with Events API
 * @async
 * @param   {number}        id - product id
 * @returns {Promise<void>}    Promise that resolves when unsubscription is complete
 * @see {@link https://doc.oneentry.cloud/docs/events OneEntry CMS docs}
 */
export const onUnsubscribeEvents = async (id: number): Promise<void> => {
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
    const apiError = handleApiError('onUnsubscribeEvents', error);
    // eslint-disable-next-line no-console
    console.log('Error unsubscribing from events:', apiError.message);
  }
};
