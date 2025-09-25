/* eslint-disable no-console */
import type {
  IOrderByMarkerEntity,
  IOrderData,
} from 'oneentry/dist/orders/ordersInterfaces';
import type { FC } from 'react';

import { updateOrderByMarkerAndId } from '@/app/api';
import Loader from '@/components/shared/Loader';

interface CancelOrderButtonProps {
  data: IOrderByMarkerEntity;
  isLoading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refetch: any;
  title: string;
}

/**
 * Cancel order button
 * @param data
 * @param isLoading loading state
 * @param refetch
 * @param title
 *
 * @returns JSX.Element
 */
const CancelOrderButton: FC<CancelOrderButtonProps> = ({
  data,
  isLoading,
  refetch,
  title,
}) => {
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
        console.error('Failed to cancel order:', order.error);
        return null;
      }

      refetch();
      return order;
    } catch (error) {
      console.error('Error cancelling order:', error);
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
