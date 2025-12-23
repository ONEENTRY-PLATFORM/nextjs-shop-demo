/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import type { Dispatch, JSX, ReactNode } from 'react';
import { createContext, useState } from 'react';

/**
 * Filter context for managing filter state
 * @property {number}               priceFrom    - Minimum price filter
 * @property {number}               priceTo      - Maximum price filter
 * @property {string}               color        - Color filter
 * @property {boolean}              inStock      - In stock filter
 * @property {Dispatch<number>}     setPriceFrom - Price from setter
 * @property {Dispatch<number>}     setPriceTo   - Price to setter
 * @property {Dispatch<string>}     setColor     - Color setter
 * @property {Dispatch<boolean>}    setInStock   - In stock setter
 */
export const FilterContext = createContext<{
  priceFrom: number | null;
  priceTo: number | null;
  color: string;
  inStock: boolean;
  setPriceFrom: Dispatch<number | null>;
  setPriceTo: Dispatch<number | null>;
  setColor: Dispatch<string>;
  setInStock: Dispatch<boolean>;
}>({
  priceFrom: null,
  priceTo: null,
  color: '',
  inStock: false,
  setPriceFrom(_value: number | null): void {},
  setPriceTo(_value: number | null): void {},
  setColor(_value: string): void {},
  setInStock(_value: boolean): void {},
});

/**
 * Context provider for filters
 * @param   {object}      props          - Provider props
 * @param   {ReactNode}   props.children - Children ReactNode
 * @returns {JSX.Element}                Filter context provider
 */
export const FilterProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  /** Track price range filter */
  const [priceFrom, setPriceFrom] = useState<number | null>(null);
  const [priceTo, setPriceTo] = useState<number | null>(null);
  /** Track color filter */
  const [color, setColor] = useState<string>('');
  /** Track in stock filter */
  const [inStock, setInStock] = useState<boolean>(false);

  /** Provide context values to children components */
  return (
    <FilterContext.Provider
      value={{
        priceFrom,
        setPriceFrom,
        priceTo,
        setPriceTo,
        color,
        setColor,
        inStock,
        setInStock,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};
