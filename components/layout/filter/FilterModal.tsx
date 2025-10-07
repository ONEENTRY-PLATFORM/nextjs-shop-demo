import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { JSX } from 'react';
import { Suspense } from 'react';

import Loader from '@/components/shared/Loader';

import ModalBackdrop from '../modal/components/ModalBackdrop';
import FilterModalAnimations from './animations/FilterModalAnimations';
import FilterHeader from './components/header/FilterHeader';
import FiltersForm from './FiltersForm';

/**
 * FilterModal.
 * @param   {object}           props            - FilterModal props.
 * @param   {string}           props.lang       - Current language shortcode.
 * @param   {IAttributeValues} props.dict       - dictionary from server api.
 * @param   {object}           props.prices     - prices fromTo extracted from one product.
 * @param   {number}           props.prices.min - min price.
 * @param   {number}           props.prices.max - max price.
 * @returns {JSX.Element}                       FilterModal.
 */
const FilterModal = ({
  lang,
  dict,
  prices,
}: {
  lang: string;
  dict: IAttributeValues;
  prices: {
    min: number;
    max: number;
  };
}): JSX.Element => {
  return (
    <FilterModalAnimations>
      <div
        id="modalBody"
        className="fixed right-0 top-0 z-20 flex size-full max-h-[90vh] min-h-[90vh] flex-col overflow-auto bg-white shadow-xl md:top-[5vh] md:overflow-hidden md:rounded-l-3xl lg:h-auto lg:w-[380px]"
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
