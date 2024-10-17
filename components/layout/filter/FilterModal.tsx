/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import type { FC } from 'react';
import { Suspense, useContext } from 'react';

import FilterModalAnimations from '@/app/animations/FilterModalAnimations';
import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';
import Loader from '@/components/shared/Loader';

import FilterHeader from './components/header/FilterHeader';
import FiltersForm from './FiltersForm';

const FilterModal: FC<{
  prices: any;
  dict: any;
}> = ({ prices, dict }) => {
  const { open, component, setTransition } = useContext(OpenDrawerContext);

  if (!open || component !== 'FilterForm') {
    return;
  }

  return (
    <FilterModalAnimations>
      <div
        id="modalBg"
        className="fixed inset-0 bg-black/30"
        onClick={() => {
          setTransition('close');
        }}
      />

      <div
        id="modalBody"
        className="fixed right-0 top-0 z-20 flex size-full min-h-[90vh] flex-col overflow-auto bg-white shadow-xl md:top-10 md:overflow-hidden md:rounded-l-3xl lg:h-auto lg:w-[380px]"
      >
        <FilterHeader dict={dict} />
        <Suspense fallback={<Loader />}>
          <FiltersForm prices={prices} dict={dict} />
        </Suspense>
      </div>
    </FilterModalAnimations>
  );
};

export default FilterModal;
