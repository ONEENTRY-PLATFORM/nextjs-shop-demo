import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

import { useAppDispatch } from '@/app/store/hooks';
import { removeProduct } from '@/app/store/reducers/CartSlice';
import DeleteIcon from '@/components/icons/delete';

const DeleteButton: React.FC<IProductsEntity> = (product) => {
  const dispatch = useAppDispatch();
  return (
    <button
      className="group relative box-border flex size-5 shrink-0 flex-col items-center justify-center"
      aria-label="Delete item"
      onClick={() => {
        dispatch(removeProduct(product.id));
      }}
    >
      <DeleteIcon />
    </button>
  );
};

export default DeleteButton;
