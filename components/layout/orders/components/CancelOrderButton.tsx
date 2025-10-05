/* eslint-disable no-console */
import type {
  IOrderByMarkerEntity,
  IOrderData,
} from 'oneentry/dist/orders/ordersInterfaces';
import type { JSX } from 'react';

import { updateOrderByMarkerAndId } from '@/app/api';
import Loader from '@/components/shared/Loader';

/**
 * Cancel order button
 * @param   {object}               props           - order data
 * @param   {IOrderByMarkerEntity} props.data      - order data
 * @param   {boolean}              props.isLoading - loading state
 * @param   {unknown}              props.refetch   - refetch orders
 * @param   {string}               props.title     - button title
 * @returns {JSX.Element}                          JSX.Element
 */
const CancelOrderButton = ({
  data,
  isLoading,
  refetch,
  title,
}: {
  data: IOrderByMarkerEntity;
  isLoading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refetch: any;
  title: string;
}): JSX.Element => {
  // cancel order handle - updateOrderByMarkerAndId on server
  const cancelOrderHandle = async () => {
    const formData = {
      ...data,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      products: data.products?.map((product: any) => ({
        productId: product.id,
        quantity: product.quantity,
      })),
      statusIdentifier: 'canceled',
    } as IOrderData;

    try {
      const order = await updateOrderByMarkerAndId({
        marker: 'order',
        id: data.id,
        data: formData,
      });

      if (order.isError) {
        console.log('Failed to cancel order:', order.error);
        return null;
      }

      refetch();
      return order;
    } catch (error) {
      console.log('Error cancelling order:', error);
      return null;
    }
  };

  return (
    <button
      onClick={() => cancelOrderHandle()}
      type="button"
      className="btn btn-sm btn-o btn-o-primary"
    >
      {title} {isLoading && <Loader />}
    </button>
  );
};

export default CancelOrderButton;
