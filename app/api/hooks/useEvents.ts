import { api } from '@/app/api';

/**
 * Subscribe events with Events API
 *
 * @param id product id
 *
 * @returns void
 */
export const onSubscribeEvents = async (id: number) => {
  try {
    await api.Events.subscribeByMarker('catalog_event', id);
    await api.Events.subscribeByMarker('status_out_of_stock', id);
    await api.Events.subscribeByMarker('product_price', id);
  } catch (e) {
    console.log(e);
  }
};

/**
 * Unsubscribe events with Events API
 *
 * @param id product id
 *
 * @returns void
 */
export const onUnsubscribeEvents = async (id: number) => {
  try {
    await api.Events.unsubscribeByMarker('catalog_event', id);
    await api.Events.unsubscribeByMarker('status_out_of_stock', id);
    await api.Events.unsubscribeByMarker('product_price', id);
  } catch (e) {
    console.log(e);
  }
};
