import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { JSX } from 'react';

import CloseModal from './CloseModal';
import HistoryBack from './HistoryBack';

/**
 * FilterHeader component that displays the header section of the filter modal.
 * This component includes the back button, filter title, and close button.
 * @param   {object}           props      - Component properties
 * @param   {IAttributeValues} props.dict - Dictionary with localized values from server API
 * @returns {JSX.Element}                 Filter header with navigation and title elements
 */
const FilterHeader = ({ dict }: { dict: IAttributeValues }): JSX.Element => {
  /** Extract the filter button text from the dictionary */
  const { open_filters_button } = dict;

  return (
    /** Header container with background styling and padding */
    <header className="flex w-full flex-col justify-center whitespace-nowrap bg-[#F6F7F9] p-8 text-2xl font-bold text-neutral-600 max-md:px-6 max-md:py-4">
      <div className="flex justify-between gap-5">
        {/** Back navigation button */}
        <HistoryBack />
        {/** Filter title text from dictionary or fallback to 'Filter' */}
        <div className="my-auto">{open_filters_button?.value || 'Filter'}</div>
        {/** Close modal button */}
        <CloseModal />
      </div>
    </header>
  );
};

export default FilterHeader;
