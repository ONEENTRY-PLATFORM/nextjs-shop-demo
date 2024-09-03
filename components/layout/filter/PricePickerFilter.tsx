import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { getTrackBackground, Range } from 'react-range';

import { useAppSelector } from '@/app/store/hooks';

import PriceFromInput from './PriceFromInput';
import PriceToInput from './PriceToInput';

const PriceFilter: React.FC = () => {
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const [values, setValues] = useState([0, 100]);

  const STEP = 10;
  const MIN = 0;
  const MAX = 100;

  const priceFromLabel = useAppSelector(
    (state) => state.systemContentReducer.content.price_from,
  );
  const priceToLabel = useAppSelector(
    (state) => state.systemContentReducer.content.price_to,
  );

  const params = new URLSearchParams(searchParams);

  const setPriceFrom = () => {
    if (values[0]) {
      params.set('minPrice', values[0].toFixed(2));
    } else {
      params.delete('minPrice');
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const setPriceTo = () => {
    if (values[1]) {
      params.set('maxPrice', values[1].toFixed(2));
    } else {
      params.delete('maxPrice');
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative box-border flex shrink-0 flex-col">
      <div className="mb-5 ml-2.5 self-start text-base leading-8 text-neutral-600">
        Price, $
      </div>

      <div className="mb-10 flex w-full gap-5 self-center">
        <div className="flex flex-1 gap-2.5 rounded-3xl bg-neutral-100 px-3 py-2.5">
          <span className="text-base leading-8 text-slate-300">
            {priceFromLabel}
          </span>
          <span className="text-lg leading-8 text-neutral-600">
            <PriceFromInput priceFrom={values[0]} setPriceFrom={setPriceFrom} />
          </span>
        </div>
        <div className="flex flex-1 gap-2.5 rounded-3xl bg-neutral-100 p-2.5">
          <span className="self-start text-base leading-8 text-slate-300">
            {priceToLabel}
          </span>
          <span className="text-lg leading-8 text-neutral-600">
            <PriceToInput priceTo={values[1]} setPriceTo={setPriceTo} />
          </span>
        </div>
      </div>

      <div className="mb-2 mt-2 flex w-full">
        <Range
          label="Select your value"
          step={STEP}
          min={MIN}
          max={MAX}
          values={values}
          onChange={(values) => {
            setValues(values);
          }}
          renderMark={({ props, index }) => (
            <div
              {...props}
              key={props.key}
              style={{
                ...props.style,
                height: '16px',
                width: '1px',
                backgroundColor: index * STEP < values[0] ? '#548BF4' : '#ccc',
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
                    values: values,
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
                boxShadow: '0px 2px 6px #AAA',
              }}
            />
          )}
        />
      </div>
      <div className="mb-5 flex w-full justify-between gap-5 self-center text-base leading-8 text-slate-300">
        <span>{MIN}</span>
        <span>{(MAX - MIN) / 2}</span>
        <span>{MAX}</span>
      </div>
    </div>
  );
};

export default PriceFilter;
