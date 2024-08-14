'use client';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

import { addProductToCart } from '@/app/store/reducers/CartSlice';

interface AddToCartProps {
  product: IProductsEntity;
}

const AddToCartButton: React.FC<AddToCartProps> = ({ product }) => {
  return (
    <button
      onClick={() => {
        console.log(product);
        addProductToCart(product);
      }}
      className="rounded-3xl border border-solid border-orange-500 px-4 py-2.5 text-center text-sm font-bold text-orange-500"
    >
      ADD TO CART
    </button>
  );
};

export default AddToCartButton;
