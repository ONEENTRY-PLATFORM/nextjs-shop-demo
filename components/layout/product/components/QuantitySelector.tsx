'use client';

import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import React from 'react';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  decreaseProductQty,
  increaseProductQty,
  selectCartItemWithIdLength,
  setProductQty,
  removeProduct,
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
          if (quantity <= 1) {
            dispatch(removeProduct(id));
          } else {
            dispatch(decreaseProductQty({ id: id, quantity: 1 }));
          }
        }}
        className="relative box-border h-full w-8 self-stretch text-center"
        aria-label="Decrease quantity"
      >
        –
      </button>
      <input
        className="relative box-border w-16 bg-transparent text-center"
        type="number"
        name={'qty_selector_' + id}
        id={'qty_selector_' + id}
        value={quantity}
        onChange={(e) => {
          dispatch(
            setProductQty({
              id: id,
              quantity: Number(e.target.value),
            }),
          );
        }}
      />
      <button
        onClick={() => {
          dispatch(increaseProductQty({ id: id, quantity: 1 }));
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
