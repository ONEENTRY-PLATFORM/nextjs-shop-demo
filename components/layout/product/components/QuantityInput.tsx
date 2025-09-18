'use client';

import type { ChangeEvent, FC } from 'react';

import { useAppDispatch } from '@/app/store/hooks';
import { setProductQty } from '@/app/store/reducers/CartSlice';

interface QuantitySelectorProps {
  id: number;
  qty: number;
  units: number;
}

/**
 * Product quantity input
 * @param id - product id
 * @param qty - current cart count
 * @param units - count of product in shop
 *
 * @returns data
 */
const QuantityInput: FC<QuantitySelectorProps> = ({ id, qty, units }) => {
  const dispatch = useAppDispatch();

  // Set ProductQty in cartSlice on change input value
  const onChangeQtyHandle = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);

    // Ограничиваем значение в пределах от 1 до units
    const clampedValue = Math.max(1, Math.min(units, isNaN(value) ? 1 : value));

    dispatch(
      setProductQty({
        id: id,
        quantity: clampedValue,
        units: units,
      }),
    );
  };

  return (
    <input
      className="relative box-border h-8 w-16 rounded-full bg-transparent text-center text-slate-700 hover:bg-slate-100 hover:text-orange-500 hover:shadow-inner"
      type="number"
      name={'qty_selector_' + id}
      id={'qty_selector_' + id}
      min="1"
      max={units}
      value={qty}
      onChange={(e) => onChangeQtyHandle(e)}
    />
  );
};

export default QuantityInput;
