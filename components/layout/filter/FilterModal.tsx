import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { JSX } from 'react';
import { Suspense } from 'react';

import Loader from '@/components/shared/Loader';

import ModalBackdrop from '../modal/components/ModalBackdrop';
import FilterModalAnimations from './animations/FilterModalAnimations';
import FilterHeader from './components/header/FilterHeader';
import FiltersForm from './FiltersForm';

/**
 * FilterModal component that displays a modal with product filtering options.
 * This component serves as a container for the filter form and includes a header
 * and backdrop for the modal presentation.
 * @param   {object}           props            - Component properties
 * @param   {string}           props.lang       - Current language shortcode (e.g., 'en', 'ru')
 * @param   {IAttributeValues} props.dict       - Dictionary of attribute values from server API
 * @param   {object}           props.prices     - Price range object containing min and max values
 * @param   {number}           props.prices.min - Minimum price value for filtering
 * @param   {number}           props.prices.max - Maximum price value for filtering
 * @returns {JSX.Element}                       Filter modal component with form and backdrop
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
    /** Animate the modal entrance */
    <FilterModalAnimations>
      <div
        id="modalBody"
        className="fixed right-0 top-0 z-20 flex size-full max-h-[90vh] min-h-[90vh] flex-col overflow-auto bg-white shadow-xl md:top-[5vh] md:overflow-hidden md:rounded-l-3xl lg:h-auto lg:w-95"
      >
        {/** Display the filter header with title and close button */}
        <FilterHeader dict={dict} />
        {/** Load filter form with suspense fallback */}
        <Suspense fallback={<Loader />}>
          <FiltersForm prices={prices} lang={lang} dict={dict} />
        </Suspense>
      </div>
      {/** Backdrop overlay for modal */}
      <ModalBackdrop />
    </FilterModalAnimations>
  );
};

export default FilterModal;
