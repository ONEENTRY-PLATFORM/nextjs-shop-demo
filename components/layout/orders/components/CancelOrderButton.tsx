/* eslint-disable no-console */
import type {
  IOrderByMarkerEntity,
  IOrderData,
} from 'oneentry/dist/orders/ordersInterfaces';
import type { JSX } from 'react';

import { updateOrderByMarkerAndId } from '@/app/api';
import Loader from '@/components/shared/Loader';

/**
 * Cancel order button component.
 * Provides a button that allows users to cancel their orders by updating the order status to 'canceled'.
 * @param   {object}               props           - Component props
 * @param   {IOrderByMarkerEntity} props.data      - Order data to be canceled
 * @param   {boolean}              props.isLoading - Loading state to show spinner when processing
 * @param   {unknown}              props.refetch   - Function to refetch orders after cancellation
 * @param   {string}               props.title     - Button title text
 * @returns {JSX.Element}                          Button element with cancel order functionality
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
  /**
   * Handle order cancellation by updating the order status on the server.
   * This function prepares the form data and sends a request to update the order status to 'canceled'.
   * @returns {Promise<object|null>} The updated order object or null if an error occurred
   */
  const cancelOrderHandle = async (): Promise<object | null> => {
    /** Prepare form data with updated status */
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
      /** Send request to update order status to 'canceled' */
      const order = await updateOrderByMarkerAndId({
        marker: 'order',
        id: data.id,
        data: formData,
      });

      /** Handle error response from the API */
      if (order.isError) {
        console.log('Failed to cancel order:', order.error);
        return null;
      }

      /** Refetch orders to update the UI after successful cancellation */
      refetch();
      return order;
    } catch (error) {
      /** Handle unexpected errors */
      console.log('Error cancelling order:', error);
      return null;
    }
  };

  /* Render the cancel order button with loading indicator */
  return (
    <button
      onClick={() => cancelOrderHandle()}
      type="button"
      className="btn btn-sm btn-o btn-o-primary"
    >
      {/* Display button title and loading spinner when processing */}
      {title} {isLoading && <Loader />}
    </button>
  );
};

export default CancelOrderButton;
