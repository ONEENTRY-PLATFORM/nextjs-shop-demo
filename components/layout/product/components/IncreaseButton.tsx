import type { JSX } from 'react';
import { memo, useCallback } from 'react';

import { useAppDispatch } from '@/app/store/hooks';
import { increaseProductQty } from '@/app/store/reducers/CartSlice';

/**
 * Increase button component.
 * @param props       - The component props.
 * @param props.id    - The product ID.
 * @param props.qty   - The current cart count for the product.
 * @param props.units - The total available units of the product in the shop.
 * @returns           A button that increases the product quantity in the cart.
 */
const IncreaseButton = memo(
  ({
    id,
    qty,
    units,
  }: {
    id: number;
    qty: number;
    units: number;
  }): JSX.Element => {
    // Hook to dispatch actions to the Redux store.
    const dispatch = useAppDispatch();

    // Memoized handler function to increase the product quantity in the cart.
    const onIncreaseHandle = useCallback(() => {
      dispatch(
        increaseProductQty({
          id, // The product ID to increase the quantity for.
          quantity: 1, // The amount to increase the quantity by.
          units, // The total available units of the product.
        }),
      );
    }, [dispatch, id, units]);

    // If the current quantity in the cart equals or exceeds the available units, disable the button.
    if (qty >= units) {
      return (
        <button
          disabled // Disable the button as the maximum quantity is reached.
          className="relative cursor-not-allowed m-1 box-border size-8 rounded-full text-center text-slate-400"
          aria-label="Maximum quantity reached" // Accessibility label indicating the button is disabled.
        >
          +
        </button>
      );
    }

    return (
      <button
        onClick={onIncreaseHandle} // Call the handler when the button is clicked.
        className="relative cursor-pointer m-1 box-border size-8 rounded-full text-center text-slate-700 transition-all duration-500 hover:bg-slate-100 hover:text-orange-500 hover:shadow-inner"
        aria-label="Increase quantity" // Accessibility label for the button.
      >
        +
      </button>
    );
  },
);

IncreaseButton.displayName = 'IncreaseButton';

export default IncreaseButton;
