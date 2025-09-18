import type { FC } from 'react'; // Importing the Function Component (FC) type from React for defining component props.
import { memo, useCallback } from 'react'; // Importing memo and useCallback for performance optimization

import { useAppDispatch } from '@/app/store/hooks'; // Importing a custom hook to dispatch actions in the Redux store.
import { increaseProductQty } from '@/app/store/reducers/CartSlice'; // Importing the action to increase product quantity from the CartSlice reducer.

// Define the props expected by the IncreaseButton component.
interface ButtonProps {
  id: number; // The unique identifier for the product.
  qty: number; // The current quantity of the product in the cart.
  units: number; // The total available units of the product in the shop.
}

/**
 * Increase button component
 *
 * @param id - The product ID
 * @param qty - The current cart count for the product
 * @param units - The total available units of the product in the shop
 *
 * @returns A button that increases the product quantity in the cart
 */
// eslint-disable-next-line react/prop-types
const IncreaseButton: FC<ButtonProps> = memo(({ id, qty, units }) => {
  const dispatch = useAppDispatch(); // Hook to dispatch actions to the Redux store.

  // Memoized handler function to increase the product quantity in the cart.
  const onIncreaseHandle = useCallback(() => {
    dispatch(
      increaseProductQty({
        id: id, // The product ID to increase the quantity for.
        quantity: 1, // The amount to increase the quantity by.
        units: units, // The total available units of the product.
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
});

IncreaseButton.displayName = 'IncreaseButton';

export default IncreaseButton;
