'use client';

import type { FC } from 'react';
import React, { useEffect, useState } from 'react';

import { useAppSelector } from '@/app/store/hooks';
import { selectCartItemWithIdLength } from '@/app/store/reducers/CartSlice';

import DecreaseButton from './DecreaseButton';
import IncreaseButton from './IncreaseButton';
import QuantityInput from './QuantityInput';

interface QuantitySelectorProps {
  id: number;
  units: number;
  title: string;
  className?: string;
  height: number;
}

/**
 * Quantity selector
 * @param id - product id
 * @param units - count of product in shop
 * @param title
 * @param height
 * @param className CSS className of ref element
 *
 * @returns Quantity selector with increase decrease buttons
 */
const QuantitySelector: FC<QuantitySelectorProps> = ({
  id,
  units,
  title,
  height,
  className,
}) => {
  const [qty, setQty] = useState(0);

  // extract data from cartSlice
  const data = useAppSelector((state) => selectCartItemWithIdLength(state, id));
  const quantity = data?.quantity || 0;

  // setQty state on quantity change
  useEffect(() => {
    if (!quantity) {
      return;
    }
    setQty(quantity);
  }, [quantity]);

  if (qty < 1 || !quantity) {
    return;
  }

  return (
    <div
      className={
        'flex items-center justify-between rounded-3xl bg-slate-50 px-2' +
        className
      }
      style={{ height: height }}
    >
      <DecreaseButton id={id} qty={qty} title={title} />
      <QuantityInput id={id} qty={qty} units={units} />
      <IncreaseButton id={id} qty={qty} units={units} />
    </div>
  );
};

export default QuantitySelector;
