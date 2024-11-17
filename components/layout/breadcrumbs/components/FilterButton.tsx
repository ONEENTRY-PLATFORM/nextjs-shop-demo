'use client';

import { usePathname } from 'next/navigation';
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { FC } from 'react';
import { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';
import FilterIcon from '@/components/icons/filter';

/**
 * Filter button in breadcrumbs section
 * @param dict dictionary from server api
 *
 * @returns JSX.Element
 */
const FilterButton: FC<{ dict: IAttributeValues }> = ({ dict }) => {
  const path = usePathname();
  const { setOpen, setComponent } = useContext(OpenDrawerContext);

  const { open_filters_button } = dict;

  if (path.indexOf('shop') === -1 || path.indexOf('product') !== -1) {
    return;
  }

  return (
    <button
      type="button"
      className="group flex items-center gap-2 bg-white text-slate-800 transition-colors hover:text-orange-500"
      aria-label="Filter"
      onClick={() => {
        setComponent('FilterForm');
        setOpen(true);
      }}
    >
      <FilterIcon /> {open_filters_button?.value}
    </button>
  );
};

export default FilterButton;
