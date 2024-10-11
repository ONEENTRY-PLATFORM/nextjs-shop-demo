import type { FC } from 'react';

import { useAppDispatch } from '@/app/store/hooks';
import {
  decreaseProductQty,
  removeProduct,
} from '@/app/store/reducers/CartSlice';

interface ButtonProps {
  id: number;
  qty: number;
}

const DecreaseButton: FC<ButtonProps> = ({ id, qty }) => {
  const dispatch = useAppDispatch();
  if (qty < 1) {
    return;
  }

  return (
    <button
      onClick={() => {
        if (qty <= 1) {
          dispatch(removeProduct(id));
        } else {
          dispatch(decreaseProductQty({ id: id, quantity: 1 }));
        }
      }}
      className="relative m-1 box-border size-8 rounded-full text-center text-slate-700 transition-all duration-500 hover:bg-slate-100 hover:text-orange-500 hover:shadow-inner"
      aria-label="Decrease quantity"
    >
      –
    </button>
  );
};

export default DecreaseButton;
