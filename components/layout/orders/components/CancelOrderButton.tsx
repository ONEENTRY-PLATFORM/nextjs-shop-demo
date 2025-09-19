import type {
  IOrderByMarkerEntity,
  IOrderData,
  IOrderProductData,
} from 'oneentry/dist/orders/ordersInterfaces';
import type { FC } from 'react';

import { updateOrderByMarkerAndId } from '@/app/api';
import type { IOrderProducts } from '@/app/types/global';
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
      products: data.products.map((product: IOrderProducts) => ({
        productId: product.id,
        quantity: product.quantity,
      })) as IOrderProductData[],
      statusIdentifier: 'canceled',
    } as IOrderData;

    const order = await updateOrderByMarkerAndId({
      marker: 'order',
      id: data.id,
      data: formData,
    });

    refetch();
    return order;
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
