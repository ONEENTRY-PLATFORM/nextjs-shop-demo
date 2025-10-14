'use client';

import type { ChangeEvent, JSX } from 'react';

import { useAppDispatch } from '@/app/store/hooks';
import { setProductQty } from '@/app/store/reducers/CartSlice';

/**
 * Product quantity input component.
 * Allows users to directly input a specific quantity for a product in their cart.
 * Validates input to ensure it stays within acceptable limits (1 to available units).
 * Updates the Redux store with the new quantity value when changed.
 * @param   {object}      props       - Component properties.
 * @param   {number}      props.id    - Product ID for identification and cart operations.
 * @param   {number}      props.qty   - Current cart quantity for the product.
 * @param   {number}      props.units - Count of product available in shop (maximum allowed quantity).
 * @returns {JSX.Element}             - A JSX element representing the quantity input field.
 */
const QuantityInput = ({
  id,
  qty,
  units,
}: {
  id: number;
  qty: number;
  units: number;
}): JSX.Element => {
  /** Redux dispatch function for state updates */
  const dispatch = useAppDispatch();

  /**
   * Handles changes to the quantity input field.
   * Parses the input value, validates it against minimum (1) and maximum (units) constraints,
   * and dispatches an action to update the product quantity in the Redux store.
   * If the input is invalid or empty, defaults to 1.
   * @param   {ChangeEvent<HTMLInputElement>} e - The change event from the input field.
   * @returns {void}
   * @private
   */
  const onChangeQtyHandle = (e: ChangeEvent<HTMLInputElement>) => {
    /** Parse the input value to an integer using base 10 */
    const value = parseInt(e.target.value, 10);

    /**
     * Clamp the parsed value to ensure it is between 1 and the maximum available units
     * If the parsed value is NaN (e.g., empty input), default to 1
     */
    const clampedValue = Math.max(1, Math.min(units, isNaN(value) ? 1 : value));

    /** Dispatch an action to update the product quantity in the Redux store */
    dispatch(
      setProductQty({
        id: id, // The product ID used to identify which product's quantity to update
        quantity: clampedValue, // The validated and clamped quantity value to set
        units: units, // The total available units for reference and validation
      }),
    );
  };

  return (
    <input
      className="relative box-border h-8 w-16 rounded-full bg-transparent text-center text-slate-700 hover:bg-slate-100 hover:text-orange-500 hover:shadow-inner"
      type="number" // Input type is number to allow only numeric values and display appropriate keyboard on mobile devices
      name={'qty_selector_' + id} // Unique name attribute for form identification and accessibility
      id={'qty_selector_' + id} // Unique ID attribute for label association and CSS targeting
      min="1" // Minimum allowable value for the input field (prevents zero or negative quantities)
      max={units} // Maximum allowable value for the input field (limited by available stock)
      value={qty} // Current value of the input, reflecting the quantity already in the cart
      onChange={(e) => onChangeQtyHandle(e)} // Event handler triggered when the user changes the input value
      aria-label={`Quantity selector for product ${id}`} // Accessibility label describing the input purpose
    />
  );
};

export default QuantityInput;
