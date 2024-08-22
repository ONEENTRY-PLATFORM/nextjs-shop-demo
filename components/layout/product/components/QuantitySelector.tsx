'use client';

import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import React from 'react';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  decreaseProductQty,
  increaseProductQty,
  selectCartItemWithIdLength,
  setProductQty,
} from '@/app/store/reducers/CartSlice';

const QuantitySelector: React.FC<{ product: IProductsEntity }> = ({
  product,
}) => {
  const { id } = product;
  const dispatch = useAppDispatch();
  const { quantity } = useAppSelector((state) =>
    selectCartItemWithIdLength(state, id),
  ) as unknown as IProductsEntity & { selected: boolean } & {
    quantity: number;
  };

  return (
    <div className="flex h-[42px] items-center justify-between gap-2 rounded-3xl bg-stone-50">
      <button
        onClick={() => {
          dispatch(decreaseProductQty({ id: id, quantity: 1 }));
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
        value={quantity}
        onChange={(e) => {
          dispatch(
            setProductQty({
              id: product.id,
              quantity: Number(e.target.value),
            }),
          );
        }}
      />
      <button
        onClick={() => {
          dispatch(increaseProductQty({ id: product.id, quantity: 1 }));
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
