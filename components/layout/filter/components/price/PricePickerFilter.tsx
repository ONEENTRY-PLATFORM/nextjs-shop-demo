/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { getTrackBackground, Range } from 'react-range';

import PriceFromInput from './PriceFromInput';
import PriceToInput from './PriceToInput';

interface PriceFilterProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prices: any;
  dict: IAttributeValues;
}

/**
 * Price filter
 * @param prices prices fromTo extracted from one product
 * @param dict dictionary from server api
 *
 * @returns
 */
const PriceFilter: FC<PriceFilterProps> = ({ prices, dict }) => {
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const { filter_price_title } = dict;

  const STEP = 10;
  const MIN = prices?.min || 0;
  const MAX = prices?.max || 100;

  const [priceFrom, setPriceFrom] = useState(
    params.get('minPrice') ? Number(params.get('minPrice')) : MIN,
  );
  const [priceTo, setPriceTo] = useState(
    params.get('maxPrice') ? Number(params.get('maxPrice')) : MAX,
  );

  const { price_from, price_to } = dict;

  // params minPrice
  useEffect(() => {
    if (priceFrom && priceFrom !== MIN) {
      params.set('minPrice', priceFrom.toString());
    } else {
      params.delete('minPrice');
    }
    replace(`${pathname}?${params.toString()}`);
  }, [priceFrom]);

  // params maxPrice
  useEffect(() => {
    if (priceTo && priceTo !== MAX) {
      params.set('maxPrice', priceTo.toString());
    } else {
      params.delete('maxPrice');
    }
    replace(`${pathname}?${params.toString()}`);
  }, [priceTo]);

  // setPriceFrom
  useEffect(() => {
    if (!params.get('minPrice')) {
      setPriceFrom(MIN);
    }
  }, [params.get('minPrice')]);

  // setPriceTo
  useEffect(() => {
    if (!params.get('maxPrice')) {
      setPriceTo(MAX);
    }
  }, [params.get('maxPrice')]);

  return (
    <div className="relative box-border flex shrink-0 flex-col">
      <div className="mb-5 self-start text-lg font-medium leading-8 text-[#4C4D56]">
        {filter_price_title?.value}
      </div>

      <div className="mb-6 flex w-full gap-5 self-center">
        <div className="flex flex-1 gap-2.5 rounded-3xl bg-[#F6F7F9] px-3 py-1.5">
          <span className="text-base leading-8 text-slate-300">
            {price_from?.value}
          </span>
          <span className="text-lg leading-8 text-neutral-600">
            <PriceFromInput price={priceFrom} setPrice={setPriceFrom} />
          </span>
        </div>
        <div className="flex flex-1 gap-2.5 rounded-3xl bg-[#F6F7F9] px-3 py-1.5">
          <span className="self-start text-base leading-8 text-slate-300">
            {price_to?.value}
          </span>
          <span className="text-lg leading-8 text-neutral-600">
            <PriceToInput price={priceTo} setPrice={setPriceTo} />
          </span>
        </div>
      </div>

      <div className="flex w-full justify-between gap-5 self-center text-base leading-8 text-slate-300">
        <span>{MIN}</span>
        <span>{(MAX - MIN) / 2}</span>
        <span>{MAX}</span>
      </div>
      <div className="mb-5 flex w-full px-2">
        <Range
          label="Select your price"
          step={STEP}
          min={MIN}
          max={MAX}
          values={[priceFrom, priceTo]}
          onChange={(values) => {
            setPriceFrom(values[0]);
            setPriceTo(values[1]);
          }}
          renderMark={({ props, index }) => (
            <div
              {...props}
              key={props.key}
              style={{
                ...props.style,
                height: '16px',
                width: '1px',
                backgroundColor:
                  index * STEP < priceFrom
                    ? '#ccc'
                    : index * STEP > priceTo
                      ? '#ccc'
                      : '#ffa03d',
              }}
            />
          )}
          renderTrack={({ props, children }) => (
            <div
              onMouseDown={props.onMouseDown}
              onTouchStart={props.onTouchStart}
              style={{
                ...props.style,
                height: '36px',
                display: 'flex',
                width: '100%',
              }}
            >
              <div
                ref={props.ref}
                style={{
                  height: '5px',
                  width: '100%',
                  borderRadius: '4px',
                  background: getTrackBackground({
                    values: [priceFrom, priceTo],
                    colors: ['#ccc', '#ffa03d', '#ccc'],
                    min: MIN,
                    max: MAX,
                  }),
                  alignSelf: 'center',
                }}
              >
                {children}
              </div>
            </div>
          )}
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          renderThumb={({ index, props, isDragged }) => (
            <div
              {...props}
              key={props.key}
              style={{
                ...props.style,
                height: '20px',
                width: '20px',
                borderRadius: '50%',
                backgroundColor: '#f97316',
                outline: '3px solid #ec722b80',
              }}
            />
          )}
        />
      </div>
    </div>
  );
};

export default PriceFilter;
