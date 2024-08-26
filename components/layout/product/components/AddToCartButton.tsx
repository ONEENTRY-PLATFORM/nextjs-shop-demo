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
  height: number;
}

const AddToCartButton: React.FC<AddToCartProps> = ({
  product,
  className,
  height,
}) => {
  const dispatch = useAppDispatch();
  const inCart = useAppSelector((state) => selectIsInCart(state, product.id));

  if (
    typeof product.statusIdentifier === 'string' &&
    product.statusIdentifier !== 'in_stock'
  ) {
    return (
      <button onClick={() => {}} type="button" className={className}>
        Out of stock
      </button>
    );
  }

  return !inCart ? (
    <button
      onClick={() => {
        dispatch(addProductToCart({ ...product, selected: true, quantity: 1 }));
      }}
      type="button"
      className={className}
    >
      Add to cart
    </button>
  ) : (
    <QuantitySelector product={product} height={height} />
  );
};

export default AddToCartButton;
