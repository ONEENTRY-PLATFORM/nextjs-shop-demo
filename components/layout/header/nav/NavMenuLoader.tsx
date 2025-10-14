import type { JSX } from 'react';

import type { LoaderProps } from '@/app/types/global';

/**
 * Main navigation menu loader component for displaying skeleton placeholders while menu data is loading.
 * Renders animated placeholder elements to indicate that navigation menu items are being fetched.
 * @param   {LoaderProps} props       - Component props.
 * @param   {number}      props.limit - Number of menu items to load.
 * @returns {JSX.Element}             JSX.Element.
 */
const NavMenuLoader = ({ limit = 3 }: LoaderProps): JSX.Element => {
  return (
    /**
     * Container for navigation menu loaders with vertical alignment and responsive spacing
     * Uses flex layout to arrange loader items horizontally with consistent gaps
     */
    <div className="my-auto flex gap-5 max-md:max-w-full">
      {/** Map through the limit count to create placeholder elements */}
      {Array.from(Array(limit).keys()).map((item) => (
        /**
         * Individual loader element with animation
         * Represents a single navigation menu item with loading animation
         */
        <div
          key={item}
          className="animate-loader relative box-border flex size-6 shrink-0"
        ></div>
      ))}
    </div>
  );
};

export default NavMenuLoader;
