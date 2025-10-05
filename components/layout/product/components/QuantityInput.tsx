'use client';

import type { ChangeEvent, JSX } from 'react';

import { useAppDispatch } from '@/app/store/hooks';
import { setProductQty } from '@/app/store/reducers/CartSlice';

/**
 * Product quantity input component.
 * @param   {object}      props       - Component properties.
 * @param   {number}      props.id    - product id.
 * @param   {number}      props.qty   - current cart count.
 * @param   {number}      props.units - count of product in shop.
 * @returns {JSX.Element}             A JSX element representing the quantity input field.
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
  const dispatch = useAppDispatch();

  // Set ProductQty in cartSlice on change input value
  const onChangeQtyHandle = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);

    // Clamp the parsed value to ensure it is between 1 and the maximum available units.
    const clampedValue = Math.max(1, Math.min(units, isNaN(value) ? 1 : value));

    // Dispatch an action to update the product quantity in the Redux store.
    dispatch(
      setProductQty({
        id: id, // The product ID.
        quantity: clampedValue, // The clamped quantity value.
        units: units, // The total available units.
      }),
    );
  };

  return (
    <input
      className="relative box-border h-8 w-16 rounded-full bg-transparent text-center text-slate-700 hover:bg-slate-100 hover:text-orange-500 hover:shadow-inner"
      type="number" // Input type is number to allow only numeric values.
      name={'qty_selector_' + id} // Unique name for the input field based on product ID.
      id={'qty_selector_' + id} // Unique ID for the input field based on product ID.
      min="1" // Minimum allowable value for the input.
      max={units} // Maximum allowable value for the input.
      value={qty} // Current value of the input, reflecting the quantity in the cart.
      onChange={(e) => onChangeQtyHandle(e)} // Attach the change event handler.
    />
  );
};

export default QuantityInput;
