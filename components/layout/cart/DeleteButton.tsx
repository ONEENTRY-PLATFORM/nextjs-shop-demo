import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { removeProduct } from '@/app/store/reducers/CartSlice';
import DeleteIcon from '@/components/icons/delete';

const DeleteButton: React.FC = () => {
  const dispatch = useAppDispatch();
  return (
    <button
      className="relative box-border flex size-8 shrink-0 flex-col items-center justify-center"
      aria-label="Delete item"
      onClick={() => {
        dispatch(removeProduct({ ...product, selected: true }));
      }}
    >
      <DeleteIcon />
    </button>
  );
};

export default DeleteButton;
