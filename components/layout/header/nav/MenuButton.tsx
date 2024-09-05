'use client';

import { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

const MenuButton = () => {
  const { open, setOpen, setComponent } = useContext(OpenDrawerContext);

  return (
    <button
      onClick={() => {
        setOpen(true);
        setComponent('MobileMenu');
      }}
      aria-label="Open menu"
      className="flex size-10 flex-col items-center justify-center gap-1 rounded-md transition-colors md:hidden dark:border-neutral-700 dark:text-white"
    >
      <span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
      <span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
      <span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
    </button>
  );
};

export default MenuButton;
