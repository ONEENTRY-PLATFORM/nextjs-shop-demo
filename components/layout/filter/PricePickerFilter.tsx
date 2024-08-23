import React from 'react';

import { useAppSelector } from '@/app/store/hooks';

import PriceFromInput from './PriceFromInput';
import PriceToInput from './PriceToInput';

const PriceFilter: React.FC = () => {
  const priceTo = useAppSelector(
    (state) => state.systemContentReducer.content.price_to,
  );
  const priceFrom = useAppSelector(
    (state) => state.systemContentReducer.content.price_from,
  );
  return (
    <div className="relative box-border flex shrink-0 flex-col">
      <div className="mb-5 ml-2.5 self-start text-base leading-8 text-neutral-600">
        Price, $
      </div>

      <div className="mb-10 flex w-full gap-5 self-center">
        <div className="flex flex-1 gap-2.5 rounded-3xl bg-neutral-100 px-3 py-2.5">
          <span className="text-base leading-8 text-slate-300">
            {priceFrom}
          </span>
          <span className="text-lg leading-8 text-neutral-600">
            <PriceFromInput />
          </span>
        </div>
        <div className="flex flex-1 gap-2.5 rounded-3xl bg-neutral-100 p-2.5">
          <span className="self-start text-base leading-8 text-slate-300">
            {priceTo}
          </span>
          <span className="text-lg leading-8 text-neutral-600">
            <PriceToInput />
          </span>
        </div>
      </div>

      <div className="flex w-full justify-between gap-5 self-center text-base leading-8 text-slate-300">
        <span>5</span>
        <span>10</span>
        <span>30</span>
      </div>

      <div className="mb-5 mt-2 flex w-[150px] max-w-full">
        <div className="my-auto h-[7px] w-full shrink-0 rounded bg-orange-500" />
        <div className="flex size-5 min-w-[20px] flex-col justify-center rounded-full bg-orange-500 bg-opacity-50 p-0.5">
          <div className="size-4 shrink-0 rounded-full bg-orange-500" />
        </div>
      </div>
    </div>
  );
};

export default PriceFilter;
