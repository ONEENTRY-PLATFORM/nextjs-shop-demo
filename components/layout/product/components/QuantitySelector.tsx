'use client';

import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  selectCartItemWithIdLength,
  setProductQty,
} from '@/app/store/reducers/CartSlice';

import DecreaseButton from './DecreaseButton';
import IncreaseButton from './IncreaseButton';

interface QuantitySelectorProps {
  product: IProductsEntity;
  className?: string;
  height: number;
}

const QuantitySelector: FC<QuantitySelectorProps> = ({
  product,
  height,
  className,
}) => {
  const { id, attributeValues } = product;
  const [qty, setQty] = useState(0);
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) =>
    selectCartItemWithIdLength(state, id),
  ) as { id: number; selected: boolean; quantity: number };
  const quantity = data?.quantity || 0;

  // setQty
  useEffect(() => {
    if (!quantity) {
      return;
    }
    setQty(quantity);
  }, [quantity]);

  if (qty < 1 || !quantity) {
    return;
  }

  const units = attributeValues?.units_product?.value || 0;

  return (
    <div
      className={
        'flex items-center justify-between rounded-3xl bg-slate-50 px-2' +
        className
      }
      style={{ height: height }}
    >
      <DecreaseButton id={id} qty={qty} title={product.localizeInfos.title} />
      <input
        className="relative box-border h-8 w-16 rounded-full bg-transparent text-center text-slate-700 hover:bg-slate-100 hover:text-orange-500 hover:shadow-inner"
        type="number"
        name={'qty_selector_' + id}
        id={'qty_selector_' + id}
        value={qty}
        onChange={(e) => {
          dispatch(
            setProductQty({
              id: id,
              quantity: Number(e.target.value),
              units: units,
            }),
          );
        }}
      />
      <IncreaseButton id={id} qty={qty} units={units} />
    </div>
  );
};

export default QuantitySelector;
