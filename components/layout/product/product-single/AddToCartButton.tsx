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
      className="mt-6 rounded-[30px] border border-solid border-orange-500 bg-orange-500 px-5 py-4 text-center text-base font-bold uppercase text-white max-md:px-5"
    >
      Add to cart
    </button>
  );
};

export default AddToCartButton;
