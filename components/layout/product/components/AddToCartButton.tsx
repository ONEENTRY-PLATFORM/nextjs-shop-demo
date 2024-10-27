'use client';

import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

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
  dict: IAttributeValues;
}

const AddToCartButton: FC<AddToCartProps> = ({
  product,
  className,
  height,
  dict,
}) => {
  const [productInCart, setInCart] = useState(false);
  const dispatch = useAppDispatch();
  const inCart = useAppSelector((state) => selectIsInCart(state, product.id));
  const { out_of_stock_button, add_to_cart_button } = dict;

  useEffect(() => {
    setInCart(inCart);
  }, [inCart]);

  const inStock =
    typeof product.statusIdentifier === 'string' &&
    product.statusIdentifier !== 'in_stock';

  if (inStock) {
    return (
      <div className={'btn btn-o btn-o-gray ' + className}>
        {out_of_stock_button.value}
      </div>
    );
  }

  return !productInCart || !inCart ? (
    <button
      onClick={() => {
        dispatch(addProductToCart({ ...product, selected: true, quantity: 1 }));
        toast('Product ' + product.localizeInfos.title + ' added to cart!');
      }}
      type="button"
      className={className}
    >
      {add_to_cart_button.value}
    </button>
  ) : (
    <QuantitySelector product={product} height={height} />
  );
};

export default AddToCartButton;
