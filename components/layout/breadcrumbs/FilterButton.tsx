'use client';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
// import { useContext } from 'react';

// import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

const FilterButton: React.FC = () => {
  const path = usePathname();
  // const { setOpen, setComponent } = useContext(OpenDrawerContext);

  if (path.indexOf('catalog') !== 1) {
    return;
  }
  return (
    <button
      type="button"
      className="flex items-center bg-white"
      aria-label="Filter"
      onClick={() => {
        // setOpen(true);
        // setComponent('FilterForm');
      }}
    >
      <Image
        loading="lazy"
        src="/icons/filter.svg"
        width={26}
        height={26}
        className="aspect-square w-[26px] fill-neutral-600"
        alt=""
      />{' '}
      Filter
    </button>
  );
};

export default FilterButton;
