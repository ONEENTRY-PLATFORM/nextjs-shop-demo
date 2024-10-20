'use client';

import { usePathname } from 'next/navigation';
import type { FC } from 'react';
import { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';
import FilterIcon from '@/components/icons/filter';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FilterButton: FC<{ dict: any }> = ({ dict }) => {
  const path = usePathname();
  const { setOpen, setComponent } = useContext(OpenDrawerContext);

  const { open_filters_button } = dict;

  if (path.indexOf('product') !== -1) {
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
