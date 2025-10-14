'use client';

import type { JSX } from 'react';

import type { LoaderProps } from '@/app/types/global';

/**
 * Loader component for the main menu skeleton.
 * Displays animated placeholder elements while the actual menu is loading.
 * @param   {LoaderProps} props       - Component properties
 * @param   {number}      props.limit - Number of menu items to show as loading placeholders (default: 4)
 * @returns {JSX.Element}             Animated loader elements representing menu items
 */
const MainMenuLoader = ({ limit = 4 }: LoaderProps): JSX.Element => {
  return (
    <div className="relative z-20 items-center justify-center bg-white px-5 text-lg font-bold uppercase text-neutral-600 max-lg:text-sm max-md:hidden max-md:px-5 max-md:text-sm md:flex">
      {/* Container for the menu loader with responsive styling */}
      <div className="flex w-full max-w-(--breakpoint-xl) items-center justify-center py-5 max-md:px-5">
        {/* List of loading placeholders */}
        <ul className="flex w-full justify-between gap-5 max-md:flex-wrap">
          {Array.from(Array(limit).keys()).map((item) => (
            <li
              key={item}
              className="group my-auto flex w-1/4 justify-between gap-5 whitespace-nowrap py-1"
            >
              {/* Individual animated placeholder for a menu item */}
              <div className="animate-loader relative box-border flex w-full shrink-0 flex-row items-center gap-2.5 text-slate-800 hover:text-red-500">
                <div className="h-5" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MainMenuLoader;
