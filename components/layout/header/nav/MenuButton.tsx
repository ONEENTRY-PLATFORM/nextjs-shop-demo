'use client';

import { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

/**
 * Mobile menu trigger button
 *
 * @returns Mobile menu trigger button
 */
const MobileMenuTrigger = () => {
  const { setOpen, setComponent } = useContext(OpenDrawerContext);

  return (
    <button
      onClick={() => {
        setOpen(true);
        setComponent('MobileMenu');
      }}
      aria-label="Open menu"
      className="flex size-10 flex-col items-center justify-center gap-1 rounded-md transition-colors md:hidden"
    >
      <span className={'block h-0.5 w-8 bg-gray-600 '}></span>
      <span className={'block h-0.5 w-8 bg-gray-600 '}></span>
      <span className={'block h-0.5 w-8 bg-gray-600 '}></span>
    </button>
  );
};

export default MobileMenuTrigger;
