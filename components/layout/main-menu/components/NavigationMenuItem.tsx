'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { JSX } from 'react';

/**
 * Individual navigation menu item component.
 * Renders a single menu item with optional dropdown indicator and active state styling.
 * @param   {object}      props               - Component properties
 * @param   {string}      props.label         - Display text for the menu item
 * @param   {string}      props.href          - URL path the menu item links to
 * @param   {boolean}     [props.hasDropdown] - Whether the menu item has a dropdown (displays arrow icon if true)
 * @returns {JSX.Element}                     A navigation link with optional dropdown indicator
 */
const NavigationMenuItem = ({
  label,
  href,
  hasDropdown,
}: {
  label: string;
  href: string;
  hasDropdown?: boolean;
}): JSX.Element => {
  /** Get the current pathname to determine if this menu item is active */
  const paths = usePathname();
  /** Check if the current path matches this menu item's href */
  const isActive = paths === href;

  return (
    /** Link component for navigation with prefetching enabled */
    <Link
      prefetch={true}
      href={href}
      className="relative box-border flex shrink-0 flex-row items-center gap-2.5 transition-colors duration-300 hover:text-red-500"
    >
      {/* Menu item label with active state styling */}
      <div
        className={clsx(
          isActive && 'text-red-500 transition-colors duration-300',
        )}
      >
        {label}
      </div>
      {/* Dropdown indicator arrow icon (only shown when hasDropdown is true) */}
      {hasDropdown && (
        <svg
          width="27"
          height="15"
          viewBox="0 0 27 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={
            'size-4.5 ' +
            clsx(
              isActive
                ? 'fill-red-500  transition-colors duration-300'
                : 'fill-current transition-colors duration-300',
            )
          }
        >
          <path d="M12.8531 12.75L11.8278 13.8449L12.8531 14.805L13.8784 13.8449L12.8531 12.75ZM25.625 2.84488C26.2296 2.27863 26.2608 1.32939 25.6945 0.724704C25.1283 0.120017 24.1791 0.0888621 23.5744 0.655118L25.625 2.84488ZM0.0812407 2.84488L11.8278 13.8449L13.8784 11.6551L2.13183 0.655118L0.0812407 2.84488ZM13.8784 13.8449L25.625 2.84488L23.5744 0.655118L11.8278 11.6551L13.8784 13.8449Z" />
        </svg>
      )}
    </Link>
  );
};

export default NavigationMenuItem;
