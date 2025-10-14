import { type JSX, memo, useCallback, useContext } from 'react';
import { toast } from 'react-toastify';

import { onUnsubscribeEvents } from '@/app/api/hooks/useEvents';
import { useAppDispatch } from '@/app/store/hooks';
import { AuthContext } from '@/app/store/providers/AuthContext';
import {
  decreaseProductQty,
  removeProduct,
} from '@/app/store/reducers/CartSlice';

/**
 * Decrease quantity button component.
 * Provides functionality to decrease product quantity in the cart or remove it entirely when quantity reaches 1.
 * Uses memoization for performance optimization and includes user state synchronization.
 * @param   {object}      props       - The component props.
 * @param   {number}      props.id    - The product ID.
 * @param   {number}      props.qty   - The current cart count for the product.
 * @param   {string}      props.title - The name of the product.
 * @returns {JSX.Element}             A button that decreases the product quantity in the cart.
 */
const DecreaseButton = memo(
  ({
    id,
    qty,
    title,
  }: {
    id: number;
    qty: number;
    title: string;
  }): JSX.Element => {
    const dispatch = useAppDispatch();
    const { user } = useContext(AuthContext);

    /** Remove product from cart and unsubscribe from events if user is authenticated */
    const onRemoveFromCart = useCallback(async () => {
      dispatch(removeProduct(id));
      toast('Product ' + title + ' removed from cart!');

      if (user) {
        await onUnsubscribeEvents(id);
      }
    }, [dispatch, id, title, user]);

    /** Decrease product quantity in the cart */
    const onDecreaseHandle = useCallback(() => {
      dispatch(decreaseProductQty({ id: id, quantity: 1 }));
    }, [dispatch, id]);

    /** Handle click event. remove product from cart if quantity is 1, otherwise decrease quantity */
    const handleClick = useCallback(() => {
      if (qty <= 1) {
        onRemoveFromCart();
      } else {
        onDecreaseHandle();
      }
    }, [qty, onRemoveFromCart, onDecreaseHandle]);

    return (
      <button
        onClick={handleClick}
        className="relative cursor-pointer m-1 box-border size-8 rounded-full text-center text-slate-700 transition-all duration-500 hover:bg-slate-100 hover:text-orange-500 hover:shadow-inner"
        aria-label="Decrease quantity"
      >
        –
      </button>
    );
  },
);

DecreaseButton.displayName = 'DecreaseButton';

export default DecreaseButton;
