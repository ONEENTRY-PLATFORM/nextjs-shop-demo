/* eslint-disable jsdoc/reject-any-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useSearchParams } from 'next/navigation';
import type { IAttributeValues } from 'oneentry/types';
import type { JSX } from 'react';
import { memo, useCallback, useContext, useEffect, useState } from 'react';
import { getTrackBackground, Range } from 'react-range';

import { FilterContext } from '@/app/store/providers/FilterContext';

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
    /** Get current URL parameters for reading initial filter values */
    const searchParams = useSearchParams();

    /** Get filter context for managing temporary filter state */
    const { setPriceFrom: setContextPriceFrom, setPriceTo: setContextPriceTo } =
      useContext(FilterContext);

    /** Create a copy of URL parameters to work with filters */
    const params = new URLSearchParams(searchParams?.toString() || '');

    /** Extract localized values from dictionary for UI labels */
    const { filter_price_title, price_from, price_to } = dict;

    /**
     * Parse a price URL parameter into a finite number
     * @param   {string | null} value - raw URL parameter value
     * @returns {number | null}       parsed value or null when absent/invalid
     */
    const parsePrice = (value: string | null): number | null => {
      if (value === null) return null;
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : null;
    };

    /**
     * Price bounds already applied in the URL. Kept exact (not snapped to the
     * STEP grid): they are the user's active filter and must survive remounts —
     * snapping/clamping them would silently rewrite the filter on the next
     * Apply (e.g. maxPrice=95 → 100 → treated as "not set" and dropped).
     */
    const urlMinPrice = parsePrice(params.get('minPrice'));
    const urlMaxPrice = parsePrice(params.get('maxPrice'));

    /** Constants for working with price range */
    const STEP = 10;
    /**
     * Expand the raw bounds so the applied URL values always fit the slider
     * scale — ProductsNotFound renders this modal with placeholder prices
     * {min: 0, max: 1}, which would otherwise clamp the applied filter away.
     */
    const RAW_MIN = Math.min(prices?.min || 0, urlMinPrice ?? Infinity);
    const RAW_MAX = Math.max(prices?.max || 100, urlMaxPrice ?? -Infinity);

    /**
     * Align bounds to the STEP grid so that `values` are always reachable via
     * `min + n*step` — otherwise react-range logs a "values in conflict with
     * step/min/max" warning.
     */
    const MIN = Math.floor(RAW_MIN / STEP) * STEP;
    const MAX = Math.max(MIN + STEP, Math.ceil(RAW_MAX / STEP) * STEP);

    /**
     * Snap a raw value to the STEP grid and clamp it into [MIN, MAX]
     * @param   {number} value - raw value to snap
     * @returns {number}       snapped value
     */
    const snap = (value: number): number => {
      const snapped = Math.round((value - MIN) / STEP) * STEP + MIN;
      return Math.min(MAX, Math.max(MIN, snapped));
    };

    /**
     * Local states for storing "from" and "to" values of price range.
     * Seeded with the exact URL values (the slider snaps them for display
     * only), so an applied filter round-trips through remounts unchanged.
     */
    const [priceFrom, setPriceFrom] = useState(urlMinPrice ?? MIN);
    const [priceTo, setPriceTo] = useState(urlMaxPrice ?? MAX);

    /** Sync local state with context on mount and when values change */
    useEffect(() => {
      setContextPriceFrom(priceFrom !== MIN ? priceFrom : null);
      setContextPriceTo(priceTo !== MAX ? priceTo : null);
    }, [priceFrom, priceTo, MIN, MAX, setContextPriceFrom, setContextPriceTo]);

    /**
     * Handler for changing price range values when slider is moved
     * Updates only local state without URL navigation
     * @param {number[]} values - array of values [from, to]
     */
    const handlePriceChange = useCallback(
      (values: number[]): void => {
        const newPriceFrom = values[0] || 0;
        const newPriceTo = values[1] || 0;

        setPriceFrom(newPriceFrom);
        setPriceTo(newPriceTo);
      },
      [setPriceFrom, setPriceTo],
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
        <div className="text-foreground mb-5 self-start text-lg leading-8 font-medium">
          {filter_price_title?.value as string}
        </div>

        {/** Input fields for minimum and maximum price */}
        <div className="mb-6 flex w-full gap-5 self-center">
          {/** Minimum price input field */}
          <div className="bg-surface flex flex-1 gap-2.5 rounded-3xl px-3 py-1.5">
            <span className="text-base leading-8 text-slate-300">
              {price_from?.value as string}
            </span>
            <span className="text-lg leading-8 text-neutral-600">
              <PriceFromInput price={priceFrom} setPrice={setPriceFrom} />
            </span>
          </div>
          {/** Maximum price input field */}
          <div className="bg-surface flex flex-1 gap-2.5 rounded-3xl px-3 py-1.5">
            <span className="self-start text-base leading-8 text-slate-300">
              {price_to?.value as string}
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
            values={[snap(priceFrom), snap(priceTo)]}
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
