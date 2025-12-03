/* eslint-disable jsdoc/reject-any-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { JSX } from 'react';
import { memo, useCallback, useState } from 'react';
import { getTrackBackground, Range } from 'react-range';

import PriceFromInput from './PriceFromInput';
import PriceToInput from './PriceToInput';

/**
 * Price filter component that allows users to filter products by price range.
 * This component includes a range slider and input fields for setting minimum and maximum prices.
 * @param   {object}           props            - Component properties
 * @param   {IAttributeValues} props.dict       - Dictionary with localized values from API
 * @param   {object}           props.prices     - Object with minimum and maximum product prices
 * @param   {number}           props.prices.min - Minimum price value
 * @param   {number}           props.prices.max - Maximum price value
 * @returns {JSX.Element}                       Price filter component with slider and input fields
 */
const PriceFilter = memo(
  ({
    dict,
    prices,
  }: {
    dict: IAttributeValues;
    prices: {
      min: number;
      max: number;
    };
  }): JSX.Element => {
    /** Get current path and URL parameters for navigation */
    const pathname = usePathname();
    const { replace } = useRouter();
    const searchParams = useSearchParams();

    /** Create a copy of URL parameters to work with filters */
    const params = new URLSearchParams(searchParams?.toString() || '');

    /** Extract localized values from dictionary for UI labels */
    const { filter_price_title, price_from, price_to } = dict;

    /** Constants for working with price range */
    const STEP = 10;
    const MIN = prices?.min || 0;
    const MAX = prices?.max || 100;

    /** States for storing "from" and "to" values of price range */
    const [priceFrom, setPriceFrom] = useState(
      params.get('minPrice') ? Number(params.get('minPrice')) : MIN,
    );
    const [priceTo, setPriceTo] = useState(
      params.get('maxPrice') ? Number(params.get('maxPrice')) : MAX,
    );

    /**
     * Handler for changing price range values when slider is moved
     * Updates both local state and URL parameters
     * @param {number[]} values - array of values [from, to]
     */
    const handlePriceChange = useCallback(
      (values: number[]): void => {
        const newPriceFrom = values[0] || 0;
        const newPriceTo = values[1] || 0;

        setPriceFrom(newPriceFrom);
        setPriceTo(newPriceTo);

        const newParams = new URLSearchParams(searchParams?.toString() || '');

        /** Update URL with minPrice parameter if it differs from default minimum */
        if (newPriceFrom && newPriceFrom !== MIN) {
          newParams.set('minPrice', newPriceFrom.toString());
        } else {
          newParams.delete('minPrice');
        }

        /** Update URL with maxPrice parameter if it differs from default maximum */
        if (newPriceTo && newPriceTo !== MAX) {
          newParams.set('maxPrice', newPriceTo.toString());
        } else {
          newParams.delete('maxPrice');
        }

        replace(`${pathname}?${newParams.toString()}`);
      },
      [MIN, MAX, pathname, replace, searchParams, setPriceFrom, setPriceTo],
    );

    /**
     * Render markers on the range track to show price intervals
     * @param   {object}      props - element properties
     * @param   {number}      index - marker index
     * @returns {JSX.Element}       Marker element with appropriate styling
     */
    const renderMark = useCallback(
      ({ props, index }: { props: any; index: number }) => (
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
      ),
      [priceFrom, priceTo, STEP],
    );

    /**
     * Render range track with gradient background showing selected range
     * @param   {object}      props    - element properties
     * @param   {any}         children - child elements
     * @returns {JSX.Element}          Track element with background gradient
     */
    const renderTrack = useCallback(
      ({ props, children }: { props: any; children: any }) => (
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
      ),
      [priceFrom, priceTo, MIN, MAX],
    );

    /**
     * Render range "thumbs" (draggable handles) for the slider
     * @param   {object}      props - element properties
     * @returns {JSX.Element}       Thumb element with styling
     */
    const renderThumb = useCallback(
      ({ props }: { props: any; isDragged: boolean }) => (
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
      ),
      [],
    );

    return (
      <div className="relative box-border flex shrink-0 flex-col">
        {/** Price filter title */}
        <div className="mb-5 self-start text-lg font-medium leading-8 text-[#4C4D56]">
          {filter_price_title?.value}
        </div>

        {/** Input fields for minimum and maximum price */}
        <div className="mb-6 flex w-full gap-5 self-center">
          {/** Minimum price input field */}
          <div className="flex flex-1 gap-2.5 rounded-3xl bg-[#F6F7F9] px-3 py-1.5">
            <span className="text-base leading-8 text-slate-300">
              {price_from?.value}
            </span>
            <span className="text-lg leading-8 text-neutral-600">
              <PriceFromInput price={priceFrom} setPrice={setPriceFrom} />
            </span>
          </div>
          {/** Maximum price input field */}
          <div className="flex flex-1 gap-2.5 rounded-3xl bg-[#F6F7F9] px-3 py-1.5">
            <span className="self-start text-base leading-8 text-slate-300">
              {price_to?.value}
            </span>
            <span className="text-lg leading-8 text-neutral-600">
              <PriceToInput price={priceTo} setPrice={setPriceTo} />
            </span>
          </div>
        </div>

        {/** Display price range values (min, mid, max) */}
        <div className="flex w-full justify-between gap-5 self-center text-base leading-8 text-slate-300">
          <span>{MIN}</span>
          <span>{(MAX - MIN) / 2}</span>
          <span>{MAX}</span>
        </div>

        {/** Price range selection component with slider */}
        <div className="mb-5 flex w-full px-2">
          <Range
            label="Select your price"
            step={STEP}
            min={MIN}
            max={MAX}
            values={[priceFrom, priceTo]}
            onChange={handlePriceChange}
            renderMark={renderMark}
            renderTrack={renderTrack}
            renderThumb={renderThumb}
          />
        </div>
      </div>
    );
  },
);

PriceFilter.displayName = 'PriceFilter';

export default PriceFilter;
