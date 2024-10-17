/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FC } from 'react';
import { Suspense } from 'react';

import FilterModalAnimations from '@/app/animations/FilterModalAnimations';
import Loader from '@/components/shared/Loader';

import FilterHeader from './components/header/FilterHeader';
import FiltersForm from './FiltersForm';
import ModalBackdrop from './ModalBackdrop';

const FilterModal: FC<{
  prices: any;
  lang: string;
  dict: any;
}> = ({ prices, lang, dict }) => {
  return (
    <FilterModalAnimations>
      <div
        id="modalBody"
        className="fixed right-0 top-0 z-20 flex size-full min-h-[90vh] flex-col overflow-auto bg-white shadow-xl md:top-10 md:overflow-hidden md:rounded-l-3xl lg:h-auto lg:w-[380px]"
      >
        <FilterHeader dict={dict} />
        <Suspense fallback={<Loader />}>
          <FiltersForm prices={prices} lang={lang} dict={dict} />
        </Suspense>
      </div>
      <ModalBackdrop />
    </FilterModalAnimations>
  );
};

export default FilterModal;
