import { type FC, memo, useCallback, useContext } from 'react';

import { onUnsubscribeEvents } from '@/app/api/hooks/useEvents';
import { useAppDispatch } from '@/app/store/hooks';
import { AuthContext } from '@/app/store/providers/AuthContext';
import { setCartTransition } from '@/app/store/reducers/CartSlice';
import DeleteIcon from '@/components/icons/delete';

/**
 * Delete product from cart button
 * @param productId product Id
 *
 * @returns
 */
// eslint-disable-next-line react/prop-types
const DeleteButton: FC<{ productId: number }> = memo(({ productId }) => {
  const dispatch = useAppDispatch();
  const { user } = useContext(AuthContext);

  const handleDelete = useCallback(async () => {
    dispatch(setCartTransition({ productId: productId }));
    if (user) {
      await onUnsubscribeEvents(productId);
    }
  }, [dispatch, productId, user]);

  return (
    <button
      className="group cursor-pointer relative box-border flex size-5 shrink-0 flex-col items-center justify-center"
      aria-label="Delete item"
      onClick={handleDelete}
    >
      <DeleteIcon />
    </button>
  );
});

DeleteButton.displayName = 'DeleteButton';

export default DeleteButton;
