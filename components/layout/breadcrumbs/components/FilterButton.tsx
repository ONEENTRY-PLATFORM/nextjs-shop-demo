'use client';

import { usePathname } from 'next/navigation';
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { JSX } from 'react';
import { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';
import FilterIcon from '@/components/icons/filter';

/**
 * Filter button component that displays in the breadcrumbs section on shop pages
 * Provides functionality to open the filter drawer with filter options
 * Conditionally renders only on specific shop pages based on URL path
 * @param   {object}           props      - Component props
 * @param   {IAttributeValues} props.dict - Dictionary from server API containing localized translation strings
 * @returns {JSX.Element}                 The rendered filter button component or empty fragment
 */
const FilterButton = ({ dict }: { dict: IAttributeValues }): JSX.Element => {
  /** Get current pathname to determine if filter button should be displayed */
  const path = usePathname();

  /** Get functions to control the drawer state from context */
  const { setOpen, setComponent } = useContext(OpenDrawerContext);

  /** Extract localized filter button text from dictionary */
  const { open_filters_button } = dict;

  /** Conditionally render filter button only on shop pages, not on product or category pages */
  if (
    path.indexOf('shop') === -1 || // Not on shop page
    path.indexOf('product') !== -1 || // On product page
    path.indexOf('category') !== -1 // On category page
  ) {
    return <></>;
  }

  return (
    /** Filter button with click handler to open filter drawer */
    <button
      type="button"
      className="group flex cursor-pointer items-center gap-2 bg-white text-slate-800 transition-colors hover:text-orange-500"
      aria-label="Filter"
      onClick={() => {
        /** Set component to FilterForm and open the drawer when button is clicked */
        setComponent('FilterForm');
        setOpen(true);
      }}
    >
      {/** Filter icon and localized button text */}
      <FilterIcon /> {open_filters_button?.value}
    </button>
  );
};

export default FilterButton;
