import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { FC } from 'react';

import CloseModal from './CloseModal';
import HistoryBack from './HistoryBack';

interface FilterHeaderProps {
  dict: IAttributeValues;
}

/**
 * Filter Header
 * @param dict dictionary from server api
 *
 * @returns Filter Header
 */
const FilterHeader: FC<FilterHeaderProps> = ({ dict }) => {
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
