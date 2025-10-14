import { type JSX, memo } from 'react';

import type { LoaderProps } from '@/app/types/global';

/**
 * Vertical menu loader component for displaying skeleton placeholders while menu data is loading.
 * Renders animated placeholder elements to indicate that menu content is being fetched.
 * @param   {LoaderProps} props       - Loader props.
 * @param   {number}      props.limit - limit elements count.
 * @returns {JSX.Element}             menu Loaders.
 */
const VerticalMenuLoader = ({ limit = 6 }: LoaderProps): JSX.Element => {
  return (
    /**
     * Container for the vertical menu loader with responsive width adjustments
     * Uses flex layout and animation classes for skeleton effect
     */
    <div className="flex w-[21%] flex-col max-lg:w-[21%] max-md:w-1/2 max-sm:w-[45%] max-xs:w-full">
      {/** Title placeholder with animation */}
      <div className="animate-loader mb-5 mr-5 h-5 w-full"></div>
      {/** List of menu item placeholders */}
      <ul className="flex w-full flex-row gap-2 overflow-hidden py-3 text-base md:flex-col md:gap-5 md:py-0">
        {Array.from(Array(limit).keys()).map((item) => (
          <li key={item} className={`group flex h-5 justify-start gap-3 pr-5`}>
            {/** Individual menu item placeholder with animation */}
            <div className={'animate-loader h-5 min-w-full'} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default memo(VerticalMenuLoader);
