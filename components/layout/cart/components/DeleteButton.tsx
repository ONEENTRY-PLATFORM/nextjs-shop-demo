import type { FC } from 'react';

import { useAppDispatch } from '@/app/store/hooks';
import {
  removeProduct,
  setCartTransition,
} from '@/app/store/reducers/CartSlice';
import DeleteIcon from '@/components/icons/delete';

const DeleteButton: FC<{ productId: number }> = ({ productId }) => {
  const dispatch = useAppDispatch();
  return (
    <button
      className="group relative box-border flex size-5 shrink-0 flex-col items-center justify-center"
      aria-label="Delete item"
      onClick={() => {
        // dispatch(setCartTransition({ productId: productId }));
        dispatch(removeProduct(productId));
      }}
    >
      <DeleteIcon />
    </button>
  );
};

export default DeleteButton;
