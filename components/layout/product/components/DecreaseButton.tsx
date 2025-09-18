import { type FC, useContext } from 'react'; // Importing the Function Component (FC) type and useContext hook from React.
import { toast } from 'react-toastify'; // Importing the toast function for displaying notifications.

import { onUnsubscribeEvents } from '@/app/api/hooks/useEvents'; // Importing a function to unsubscribe from events.
import { useAppDispatch } from '@/app/store/hooks'; // Importing a custom hook to dispatch actions in the Redux store.
import { AuthContext } from '@/app/store/providers/AuthContext'; // Importing the AuthContext to access authentication state.
import {
  decreaseProductQty,
  removeProduct,
} from '@/app/store/reducers/CartSlice'; // Importing actions to modify the cart state.

interface ButtonProps {
  id: number; // The unique identifier for the product.
  qty: number; // The current quantity of the product in the cart.
  title: string; // The title or name of the product.
}

/**
 * Decrease quantity button component
 *
 * @param id - The product ID
 * @param qty - The current cart count for the product
 * @param title - The name of the product
 *
 * @returns A button that decreases the product quantity in the cart
 */
const DecreaseButton: FC<ButtonProps> = ({ id, qty, title }) => {
  const dispatch = useAppDispatch(); // Hook to dispatch actions to the Redux store.
  const { user } = useContext(AuthContext); // Access the authenticated user from the AuthContext.

  /**
   * Remove product from cart and unsubscribe from events if user is authenticated
   */
  const onRemoveFromCart = async () => {
    dispatch(removeProduct(id)); // Dispatch action to remove the product from the cart.
    toast('Product ' + title + ' removed from cart!'); // Show a notification that the product was removed.

    if (user) {
      await onUnsubscribeEvents(id); // Unsubscribe from events related to the product if the user is logged in.
    }
  };

  /**
   * Decrease product quantity in the cart
   */
  const onDecreaseHandle = () => {
    dispatch(decreaseProductQty({ id: id, quantity: 1 })); // Dispatch action to decrease the product quantity by 1.
  };

  return (
    <button
      onClick={async () => {
        if (qty <= 1) {
          onRemoveFromCart(); // If the quantity is 1 or less, remove the product from the cart.
        } else {
          onDecreaseHandle(); // Otherwise, just decrease the quantity.
        }
      }}
      className="relative cursor-pointer m-1 box-border size-8 rounded-full text-center text-slate-700 transition-all duration-500 hover:bg-slate-100 hover:text-orange-500 hover:shadow-inner"
      aria-label="Decrease quantity" // Accessibility label for the button.
    >
      –
    </button>
  );
};

export default DecreaseButton; // Export the component as the default export.
