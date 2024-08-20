'use client';

import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  addProductToCart,
  selectIsInCart,
} from '@/app/store/reducers/CartSlice';

import QuantitySelector from './QuantitySelector';

interface AddToCartProps {
  product: IProductsEntity;
  className: string;
}

const AddToCartButton: React.FC<AddToCartProps> = ({ product, className }) => {
  const dispatch = useAppDispatch();
  const inCart = useAppSelector((state) => selectIsInCart(state, product.id));

  return !inCart ? (
    <button
      onClick={() => {
        dispatch(addProductToCart({ ...product, selected: true }));
      }}
      type="button"
      className={className}
    >
      Add to cart
    </button>
  ) : (
    <QuantitySelector product={product} />
  );
};

export default AddToCartButton;
