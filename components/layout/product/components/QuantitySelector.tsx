'use client';

import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import React, { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  decreaseProductQty,
  increaseProductQty,
  removeProduct,
  selectCartItemWithIdLength,
  setProductQty,
} from '@/app/store/reducers/CartSlice';

const QuantitySelector: React.FC<{
  product: IProductsEntity;
  height: number;
}> = ({ product, height }) => {
  const { id } = product;
  const [qty, setQty] = useState(0);
  const dispatch = useAppDispatch();
  const { quantity } = useAppSelector((state) =>
    selectCartItemWithIdLength(state, id),
  ) as unknown as IProductsEntity & { selected: boolean } & {
    quantity: number;
  };

  useEffect(() => {
    setQty(quantity);
  }, [quantity]);

  if (qty < 1) {
    return;
  }

  return (
    <div
      className="flex items-center justify-between rounded-3xl bg-slate-50"
      style={{ height: height }}
    >
      <button
        onClick={() => {
          if (qty <= 1) {
            dispatch(removeProduct(id));
          } else {
            dispatch(decreaseProductQty({ id: id, quantity: 1 }));
          }
        }}
        className="relative m-1 box-border size-8 rounded-full text-center text-slate-800 hover:bg-slate-100 hover:text-orange-500"
        aria-label="Decrease quantity"
      >
        –
      </button>
      <input
        className="relative box-border w-16 rounded-full bg-transparent text-center text-slate-800 hover:bg-slate-100 hover:text-orange-500"
        type="number"
        name={'qty_selector_' + id}
        id={'qty_selector_' + id}
        value={qty}
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
        className="relative m-1 box-border size-8 rounded-full text-center text-slate-800 hover:bg-slate-100 hover:text-orange-500"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;
