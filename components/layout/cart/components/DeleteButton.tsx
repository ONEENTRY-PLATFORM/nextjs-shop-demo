import { type FC, useContext } from 'react';

import { onUnsubscribeEvents } from '@/app/api/hooks/useEvents';
import { useAppDispatch } from '@/app/store/hooks';
import { AuthContext } from '@/app/store/providers/AuthContext';
import {
  // removeProduct,
  setCartTransition,
} from '@/app/store/reducers/CartSlice';
import DeleteIcon from '@/components/icons/delete';

/**
 * Delete product from cart button
 * @param productId product Id
 *
 * @returns
 */
const DeleteButton: FC<{ productId: number }> = ({ productId }) => {
  const dispatch = useAppDispatch();
  const { user } = useContext(AuthContext);

  return (
    <button
      className="group relative box-border flex size-5 shrink-0 flex-col items-center justify-center"
      aria-label="Delete item"
      onClick={async () => {
        dispatch(setCartTransition({ productId: productId }));
        // dispatch(removeProduct(productId));
        if (user) {
          await onUnsubscribeEvents(productId);
        }
      }}
    >
      <DeleteIcon />
    </button>
  );
};

export default DeleteButton;
