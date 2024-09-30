'use client';

import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';
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

const AddToCartButton: FC<AddToCartProps> = ({
  product,
  className,
  height,
}) => {
  const [productInCart, setInCart] = useState(false);
  const [outStockText, setOutStockText] = useState();
  const [addToCartText, setAddToCartText] = useState();
  const dispatch = useAppDispatch();
  const inCart = useAppSelector((state) => selectIsInCart(state, product.id));
  const { out_of_stock_button, add_to_cart_button } = useAppSelector(
    (state) => state.systemContentReducer.content,
  );

  useEffect(() => {
    setInCart(inCart);
  }, [inCart]);

  useEffect(() => {
    if (out_of_stock_button) {
      setOutStockText(out_of_stock_button.value);
    }
    if (add_to_cart_button) {
      setAddToCartText(add_to_cart_button.value);
    }
  }, [add_to_cart_button, out_of_stock_button]);

  const inStock =
    typeof product.statusIdentifier === 'string' &&
    product.statusIdentifier !== 'in_stock';

  if (inStock) {
    return (
      <div className={'btn btn-o btn-o-gray ' + className}>{outStockText}</div>
    );
  }

  return !productInCart || !inCart ? (
    <button
      onClick={() => {
        dispatch(addProductToCart({ ...product, selected: true, quantity: 1 }));
      }}
      type="button"
      className={className}
    >
      {addToCartText}
    </button>
  ) : (
    <QuantitySelector product={product} height={height} />
  );
};

export default AddToCartButton;
