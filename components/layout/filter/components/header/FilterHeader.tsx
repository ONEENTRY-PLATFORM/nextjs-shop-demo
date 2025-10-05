import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { JSX } from 'react';

import CloseModal from './CloseModal';
import HistoryBack from './HistoryBack';

/**
 * Filter Header.
 * @param   {object}           props      - props.
 * @param   {IAttributeValues} props.dict - dictionary from server api.
 * @returns {JSX.Element}                 Filter Header.
 */
const FilterHeader = ({ dict }: { dict: IAttributeValues }): JSX.Element => {
  const { open_filters_button } = dict;

  return (
    <header className="flex w-full flex-col justify-center whitespace-nowrap bg-[#F6F7F9] p-8 text-2xl font-bold text-neutral-600 max-md:px-6 max-md:py-4">
      <div className="flex justify-between gap-5">
        <HistoryBack />
        <div className="my-auto">{open_filters_button?.value}</div>
        <CloseModal />
      </div>
    </header>
  );
};

export default FilterHeader;
