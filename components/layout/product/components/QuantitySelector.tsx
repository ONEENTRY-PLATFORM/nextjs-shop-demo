'use client';

import type { JSX } from 'react';
import React, { memo, useEffect, useState } from 'react';

import { useAppSelector } from '@/app/store/hooks';
import { selectCartItemWithIdLength } from '@/app/store/reducers/CartSlice';

import DecreaseButton from './DecreaseButton';
import IncreaseButton from './IncreaseButton';
import QuantityInput from './QuantityInput';

/**
 * Quantity selector
 * @param props           - Quantity selector props
 * @param props.id        - product id
 * @param props.units     - count of product in shop
 * @param props.title     - product title
 * @param props.height    - height of the selector component
 * @param props.className - CSS className of ref element
 * @returns               Quantity selector with increase decrease buttons
 */
const QuantitySelector = memo(
  ({
    id,
    units,
    title,
    height,
    className,
  }: {
    id: number;
    units: number;
    title: string;
    className?: string;
    height: number;
  }): JSX.Element => {
    const [qty, setQty] = useState(1);

    // extract data from cartSlice
    const data = useAppSelector((state) =>
      selectCartItemWithIdLength(state, id),
    );
    const quantity = data || 0;

    // setQty state on quantity change
    useEffect(() => {
      setQty(quantity > 0 ? quantity : 1);
    }, [quantity]);

    // Show the component whenever the product is added to the cart (quantity > 0)
    if (quantity <= 0) {
      return <></>;
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
  },
);

QuantitySelector.displayName = 'QuantitySelector';

export default QuantitySelector;
