'use client';

// import { usePathname } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';

import { useAppSelector } from '@/app/store/hooks';
import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';
import FilterIcon from '@/components/icons/filter';

const FilterButton: React.FC = () => {
  // const path = usePathname();
  const { setOpen, setComponent } = useContext(OpenDrawerContext);
  const [filterText, setFilterText] = useState('');

  const { open_filters_button } = useAppSelector(
    (state) => state.systemContentReducer.content,
  ) as {
    open_filters_button: {
      value: string;
    };
  };

  useEffect(() => {
    if (open_filters_button) {
      setFilterText(open_filters_button?.value);
    }
  }, [open_filters_button]);

  // if (path.indexOf('shop') === -1 || path.indexOf('product') !== -1) {
  //   return;
  // }
  // open_filters_button

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
      <FilterIcon /> {filterText}
    </button>
  );
};

export default FilterButton;
