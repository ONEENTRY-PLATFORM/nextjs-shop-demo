'use client';

import { usePathname } from 'next/navigation';
import { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';
import FilterIcon from '@/components/icons/filter';

const FilterButton: React.FC = () => {
  const path = usePathname();
  const { setOpen, setComponent } = useContext(OpenDrawerContext);

  if (path.indexOf('shop') === -1 || path.indexOf('product') !== -1) {
    return;
  }

  return (
    <button
      type="button"
      className="flex items-center bg-white text-slate-800 group"
      aria-label="Filter"
      onClick={() => {
        setComponent('FilterForm');
        setOpen(true);
      }}
    >
      <FilterIcon /> Filter
    </button>
  );
};

export default FilterButton;
