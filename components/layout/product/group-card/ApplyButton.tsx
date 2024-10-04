'use client';

import type { FC } from 'react';
import { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  addProductToCart,
  removeProduct,
  selectIsInCart,
} from '@/app/store/reducers/CartSlice';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ApplyButton: FC<{ product: any }> = ({ product }) => {
  const dispatch = useAppDispatch();
  const [productInCart, setInCart] = useState(false);
  const [applyText, setApplyText] = useState();
  const { apply_button_placeholder } = useAppSelector(
    (state) => state.systemContentReducer.content,
  );
  const inCart = useAppSelector((state) => selectIsInCart(state, product.id));

  useEffect(() => {
    setInCart(inCart);
  }, [inCart]);

  useEffect(() => {
    if (apply_button_placeholder) {
      setApplyText(apply_button_placeholder.value);
    }
  }, [apply_button_placeholder]);

  return !productInCart || !inCart ? (
    <button
      onClick={() => {
        dispatch(addProductToCart({ ...product, selected: true, quantity: 1 }));
      }}
      className="btn btn-md btn-o btn-o-primary text-sm font-bold"
    >
      {applyText}
    </button>
  ) : (
    <button
      onClick={() => {
        dispatch(removeProduct(product.id));
      }}
      className="btn btn-md btn-o btn-o-primary text-sm font-bold"
    >
      Cancel
    </button>
  );
};

export default ApplyButton;
