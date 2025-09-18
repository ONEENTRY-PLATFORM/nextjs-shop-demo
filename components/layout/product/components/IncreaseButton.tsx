import type { FC } from 'react';

import { useAppDispatch } from '@/app/store/hooks';
import { increaseProductQty } from '@/app/store/reducers/CartSlice';

interface ButtonProps {
  id: number;
  qty: number;
  units: number;
}

/**
 * Increase button
 * @param id - product id
 * @param qty - current cart count
 * @param units - count of product in shop
 *
 * @returns Increase button
 */
const IncreaseButton: FC<ButtonProps> = ({ id, qty, units }) => {
  const dispatch = useAppDispatch();
  
  // Не отображаем кнопку, если количество товара уже максимальное
  if (qty >= units) {
    return (
      <button
        disabled
        className="relative cursor-not-allowed m-1 box-border size-8 rounded-full text-center text-slate-400"
        aria-label="Maximum quantity reached"
      >
        +
      </button>
    );
  }

  // Increase product quantity
  const onIncreaseHandle = () => {
    dispatch(
      increaseProductQty({
        id: id,
        quantity: 1,
        units: units,
      }),
    );
  };

  return (
    <button
      onClick={() => onIncreaseHandle()}
      className="relative cursor-pointer m-1 box-border size-8 rounded-full text-center text-slate-700 transition-all duration-500 hover:bg-slate-100 hover:text-orange-500 hover:shadow-inner"
      aria-label="Increase quantity"
    >
      +
    </button>
  );
};

export default IncreaseButton;