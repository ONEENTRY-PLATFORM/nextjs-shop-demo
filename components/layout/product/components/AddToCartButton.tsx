'use client';

import Link from 'next/link';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import { useEffect, useState } from 'react';

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
  const [productInCart, setInCart] = useState(false);
  const dispatch = useAppDispatch();
  const inCart = useAppSelector((state) => selectIsInCart(state, product.id));

  useEffect(() => {
    setInCart(inCart);
  }, [inCart]);

  const inStock =
    typeof product.statusIdentifier === 'string' &&
    product.statusIdentifier !== 'in_stock';

  if (inStock) {
    return (
      <Link
        href={`/shop/product/` + product.id}
        onClick={() => {}}
        type="button"
        className={
          'border-slate-300 text-slate-400 bg-transparent ' + className
        }
      >
        Out of stock
      </Link>
    );
  }

  return !productInCart || !inCart ? (
    <button
      onClick={() => {
        dispatch(addProductToCart({ ...product, selected: true, quantity: 1 }));
      }}
      type="button"
      className={className + ' text-white'}
    >
      Add to cart
    </button>
  ) : (
    <QuantitySelector product={product} height={height} />
  );
};

export default AddToCartButton;
