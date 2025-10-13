import { type JSX, memo, useCallback, useContext } from 'react';

import { onUnsubscribeEvents } from '@/app/api/hooks/useEvents';
import { useAppDispatch } from '@/app/store/hooks';
import { AuthContext } from '@/app/store/providers/AuthContext';
import {
  removeProduct,
  setCartTransition,
} from '@/app/store/reducers/CartSlice';
import DeleteIcon from '@/components/icons/delete';

/**
 * Delete product from cart button component
 * Provides functionality to remove a product from the shopping cart
 * Handles both local state update and server synchronization for authenticated users
 * Uses memoization to prevent unnecessary re-renders
 * @param props           - Delete button props
 * @param props.productId - Product ID to be removed from cart
 * @returns               Delete button component with icon
 */
const DeleteButton = memo(
  ({ productId }: { productId: number }): JSX.Element => {
    /** Redux dispatch function for updating state */
    const dispatch = useAppDispatch();

    /** Get user authentication data from context */
    const { user, isAuth } = useContext(AuthContext);

    /**
     * Handle product deletion from cart
     * Sets cart transition state, removes product from local state,
     * and unsubscribes from events for authenticated users
     */
    const handleDelete = useCallback(async () => {
      /** Set cart transition state to trigger animation */
      dispatch(setCartTransition({ productId: productId }));

      /** Remove product from cart in Redux store */
      dispatch(removeProduct(productId));

      /** For authenticated users, unsubscribe from product events */
      if (user && isAuth) {
        await onUnsubscribeEvents(productId);
      }
    }, [dispatch, productId, user, isAuth]);

    return (
      /** Button element with click handler to delete product */
      <button
        className="group cursor-pointer relative box-border flex size-5 shrink-0 flex-col items-center justify-center"
        aria-label="Delete item"
        onClick={handleDelete}
      >
        {/** Delete icon component */}
        <DeleteIcon />
      </button>
    );
  },
);

DeleteButton.displayName = 'DeleteButton';

export default DeleteButton;
