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
    <div className="flex h-[42px] items-center justify-between gap-2 rounded-3xl bg-stone-50">
      <button
        onClick={() => {
          dispatch(decreaseProduct(product.id));
        }}
        className="relative box-border h-full w-8 self-stretch text-center"
        aria-label="Decrease quantity"
      >
        –
      </button>
      <input
        className="relative box-border w-16 bg-transparent text-center"
        type="text"
        name={'qty_selector_' + product.id}
        id={'qty_selector_' + product.id}
        value={items}
        onChange={(e) => {
          console.log(e);
        }}
      />
      <button
        onClick={() => {
          dispatch(addProductToCart({ ...product, selected: true }));
        }}
        className="relative box-border h-full w-8 text-center"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;
