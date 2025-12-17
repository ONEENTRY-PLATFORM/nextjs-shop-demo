import type { IAttributeValues } from 'oneentry/dist/base/utils';
import { type JSX, memo, useCallback, useContext } from 'react';
import { toast } from 'react-toastify';

import {
  onSubscribeEvents,
  onUnsubscribeEvents,
} from '@/app/api/hooks/useEvents';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { AuthContext } from '@/app/store/providers/AuthContext';
import {
  addProductToCart,
  removeProduct,
  selectCartData,
  selectCartItems,
  setCartTransition,
} from '@/app/store/reducers/CartSlice';
import DeleteIcon from '@/components/icons/delete';

/**
 * Delete product from cart button component
 * Provides functionality to remove a product from the shopping cart
 * Handles both local state update and server synchronization for authenticated users
 * Uses memoization to prevent unnecessary re-renders
 * Shows a toast notification with undo functionality
 * @param props           - Delete button props
 * @param props.dict      - Dictionary for translations
 * @param props.productId - Product ID to be removed from cart
 * @returns               - Delete button component with icon
 */
const DeleteButton = memo(
  ({
    dict,
    productId,
  }: {
    dict: IAttributeValues;
    productId: number;
  }): JSX.Element => {
    /** Redux dispatch function for updating state */
    const dispatch = useAppDispatch();

    /** Get user authentication data from context */
    const { user, isAuth } = useContext(AuthContext);

    /** Get cart data and items from Redux store */
    const productsData = useAppSelector(selectCartData);
    const cartItems = useAppSelector(selectCartItems);

    /** Extract necessary texts from dictionary */
    const { removed_text, undo_text } = dict;

    /**
     * Handle product deletion from cart
     * Sets cart transition state, removes product from local state, and unsubscribes from events for authenticated users
     * Shows a toast notification with undo functionality
     */
    const handleDelete = useCallback(async () => {
      /** Find the product data to save it for undo functionality */
      const productData = productsData.find((item) => item.id === productId);
      const productInfo = cartItems.find((item) => item.id === productId);

      if (!productData) return;

      /** Set cart transition state to trigger animation */
      dispatch(setCartTransition({ productId: productId }));

      /** Remove product from cart in Redux store */
      dispatch(removeProduct(productId));

      /** For authenticated users, unsubscribe from product events */
      if (user && isAuth) {
        await onUnsubscribeEvents(productId);
      }

      /** Show toast notification with undo button */
      toast(
        ({ closeToast }) => (
          <div className="flex items-center justify-between gap-3">
            <span>
              {productInfo?.localizeInfos?.title || 'Product'}{' '}
              {removed_text?.value || 'removed from cart'}
            </span>
            <button
              onClick={async () => {
                /** Restore the product to cart with saved data */
                dispatch(
                  addProductToCart({
                    id: productData.id,
                    selected: productData.selected,
                    quantity: productData.quantity,
                  }),
                );

                /** For authenticated users, restore subscription to product events */
                if (user && isAuth) {
                  await onSubscribeEvents(productData.id);
                }

                closeToast();
              }}
              className="rounded bg-orange-500 px-3 w-20 cursor-pointer py-1 text-sm font-semibold text-white hover:bg-orange-600"
            >
              {undo_text?.value || 'Undo'}
            </button>
          </div>
        ),
        {
          autoClose: 8000,
        },
      );
    }, [
      dispatch,
      productId,
      user,
      isAuth,
      productsData,
      cartItems,
      removed_text,
      undo_text,
    ]);

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
