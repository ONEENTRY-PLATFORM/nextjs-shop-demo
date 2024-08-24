'use client';

import { usePathname } from 'next/navigation';
import { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';
import FilterIcon from '@/components/icons/filter';

const FilterButton: React.FC = () => {
  const path = usePathname();
  const { setOpen, setComponent } = useContext(OpenDrawerContext);

  if (path.indexOf('catalog') !== 1 || path.indexOf('search') !== 1) {
    return;
  }

  return (
    <button
      type="button"
      className="flex items-center bg-white"
      aria-label="Filter"
      onClick={() => {
        setOpen(true);
        setComponent('FilterForm');
      }}
    >
      <FilterIcon /> Filter
    </button>
  );
};

export default FilterButton;
