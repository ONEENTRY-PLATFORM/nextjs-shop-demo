import type { FC } from 'react';

import { useAppDispatch } from '@/app/store/hooks';
import { increaseProductQty } from '@/app/store/reducers/CartSlice';

interface ButtonProps {
  id: number;
  qty: number;
  units: number;
}

const IncreaseButton: FC<ButtonProps> = ({ id, qty, units }) => {
  const dispatch = useAppDispatch();
  if (qty < 1) {
    return;
  }

  return (
    <button
      onClick={() => {
        dispatch(
          increaseProductQty({
            id: id,
            quantity: 1,
            units: units,
          }),
        );
      }}
      className="relative m-1 box-border size-8 rounded-full text-center text-slate-700 transition-all duration-500 hover:bg-slate-100 hover:text-orange-500 hover:shadow-inner"
      aria-label="Increase quantity"
    >
      +
    </button>
  );
};

export default IncreaseButton;
