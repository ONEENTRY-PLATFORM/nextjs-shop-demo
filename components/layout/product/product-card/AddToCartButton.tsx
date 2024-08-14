'use client';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

import { useAppDispatch } from '@/app/store/hooks';
import { addProductToCart } from '@/app/store/reducers/CartSlice';

interface AddToCartProps {
  product: IProductsEntity;
}

const AddToCartButton: React.FC<AddToCartProps> = ({ product }) => {
  const dispatch = useAppDispatch();

  return (
    <button
      onClick={() => {
        dispatch(addProductToCart({ ...product, selected: true }));
      }}
      type="button"
      className="rounded-3xl border border-solid border-orange-500 px-4 py-2.5 text-center text-sm font-bold text-orange-500"
    >
      Add to cart
    </button>
  );
};

export default AddToCartButton;
