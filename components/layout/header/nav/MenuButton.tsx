'use client';

import type { JSX } from 'react';
import { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

/**
 * Mobile menu trigger button component for opening the mobile navigation menu.
 * Renders a hamburger menu icon that, when clicked, opens the mobile menu drawer.
 * @returns {JSX.Element} Mobile menu trigger button
 */
const MobileMenuTrigger = (): JSX.Element => {
  /**
   * Get setOpen and setComponent functions from OpenDrawerContext
   * These are used to control the state of the mobile menu drawer
   */
  const { setOpen, setComponent } = useContext(OpenDrawerContext);

  return (
    /**
     * Button element that triggers the mobile menu
     * Visible only on mobile devices (hidden on medium screens and up)
     */
    <button
      onClick={() => {
        /** Set the drawer state to open */
        setOpen(true);
        /** Specify that the MobileMenu component should be rendered in the drawer */
        setComponent('MobileMenu');
      }}
      aria-label="Open menu"
      className="flex cursor-pointer size-10 flex-col items-center justify-center gap-1 rounded-md transition-colors md:hidden"
    >
      {/** Hamburger menu icon lines. Three horizontal lines that form the classic hamburger menu icon */}
      <span className={'block h-0.5 w-8 bg-gray-600 '}></span>
      <span className={'block h-0.5 w-8 bg-gray-600 '}></span>
      <span className={'block h-0.5 w-8 bg-gray-600 '}></span>
    </button>
  );
};

export default MobileMenuTrigger;
