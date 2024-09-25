/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
  IOrderByMarkerEntity,
  IOrderData,
} from 'oneentry/dist/orders/ordersInterfaces';
import type { FC } from 'react';

import { updateOrderByMarkerAndId } from '@/app/api';

const CancelOrderButton: FC<{
  data: IOrderByMarkerEntity;
  isLoading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refetch: any;
}> = ({ data, isLoading, refetch }) => {
  const { statusIdentifier } = data;

  const cancelOrder = async () => {
    const formData = {
      ...data,
      products: data.products.map((product) => ({
        productId: product.id,
        quantity: product.quantity,
      })),
      statusIdentifier: 'canceled',
    } as unknown as IOrderData;

    const order = await updateOrderByMarkerAndId('order', data.id, formData);
    refetch();
    return;
  };

  return (
    statusIdentifier === 'created' && (
      <button
        onClick={() => cancelOrder()}
        className="btn btn-sm btn-o btn-o-primary"
      >
        Cancel order
      </button>
    )
  );
};

export default CancelOrderButton;
