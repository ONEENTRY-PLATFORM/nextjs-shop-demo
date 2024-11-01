import { api } from '@/app/api';

export const onSubscribeEvents = async (id: number) => {
  try {
    await api.Events.subscribeByMarker('catalog_event', id);
    await api.Events.subscribeByMarker('status_out_of_stock', id);
    await api.Events.subscribeByMarker('product_price', id);
    console.log('onSubscribeEvents ');
  } catch (e) {
    console.log(e);
  }
};

export const onUnsubscribeEvents = async (id: number) => {
  try {
    await api.Events.unsubscribeByMarker('catalog_event', id);
    await api.Events.unsubscribeByMarker('status_out_of_stock', id);
    await api.Events.unsubscribeByMarker('product_price', id);
    console.log('onUnsubscribeEvents ');
  } catch (e) {
    console.log(e);
  }
};
