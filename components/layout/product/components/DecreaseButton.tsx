import type { FC } from 'react';

import { useAppDispatch } from '@/app/store/hooks';
import {
  decreaseProductQty,
  removeProduct,
} from '@/app/store/reducers/CartSlice';

const DecreaseButton: FC<{
  id: number;
  qty: number;
}> = ({ id, qty }) => {
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
      className="relative m-1 box-border size-8 rounded-full text-center text-slate-800 transition-all duration-500 hover:bg-slate-100 hover:text-orange-500 hover:shadow-xl"
      aria-label="Decrease quantity"
    >
      –
    </button>
  );
};

export default DecreaseButton;
