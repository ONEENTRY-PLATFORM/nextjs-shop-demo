import type { JSX } from 'react';

import type { LoaderProps } from '@/app/types/global';

/**
 * Vertical menu Loader.
 * @param   {LoaderProps} props       - Loader props.
 * @param   {number}      props.limit - limit elements count.
 * @returns {JSX.Element}             menu Loaders.
 */
export const VerticalMenuLoader = ({ limit = 6 }: LoaderProps): JSX.Element => {
  return (
    <div className="flex w-[21%] flex-col max-lg:w-[21%] max-md:w-1/2 max-sm:w-[45%] max-xs:w-full">
      <div className="animate-loader mb-5 mr-5 h-5 w-full"></div>
      <ul className="flex w-full flex-row gap-2 overflow-hidden py-3 text-base md:flex-col md:gap-5 md:py-0">
        {Array.from(Array(limit).keys()).map((item) => (
          <li key={item} className={`group flex h-5 justify-start gap-3 pr-5`}>
            <div className={'animate-loader h-5 min-w-full'} />
          </li>
        ))}
      </ul>
    </div>
  );
};
