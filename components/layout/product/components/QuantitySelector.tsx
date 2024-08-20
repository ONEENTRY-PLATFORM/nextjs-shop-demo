'use client';

import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import React from 'react';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  addProductToCart,
  decreaseProduct,
  selectCartItemWithIdLength,
} from '@/app/store/reducers/CartSlice';

const QuantitySelector: React.FC<{ product: IProductsEntity }> = ({
  product,
}) => {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) =>
    selectCartItemWithIdLength(state, product.id),
  );

  return (
    <div className="mt-6 flex items-start justify-between gap-2 rounded-3xl bg-stone-50 p-2.5 max-sm:pr-2.5">
      <button
        onClick={() => {
          dispatch(decreaseProduct(product.id));
        }}
        className="relative box-border w-5 self-stretch"
        aria-label="Decrease quantity"
      >
        –
      </button>
      <input
        className="relative box-border w-10 bg-transparent text-center"
        type="text"
        name=""
        id=""
        value={items}
      />
      <button
        onClick={() => {
          dispatch(addProductToCart({ ...product, selected: true }));
        }}
        className="relative box-border w-5"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;
