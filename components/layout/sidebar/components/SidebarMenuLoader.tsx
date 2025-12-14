'use client';

import type { JSX } from 'react';

import type { LoaderProps } from '@/app/types/global';

/**
 * Sidebar menu loader component that displays skeleton loading placeholders
 * while the actual menu items are being fetched or rendered.
 * This provides a better user experience by showing visual indicators
 * instead of empty space during loading states.
 * @param   {LoaderProps} props       - SidebarMenu props object.
 * @param   {number}      props.limit - The number of menu items to display. Defaults to 5 if not specified.
 * @returns {JSX.Element}             Sidebar menu loader with animated placeholder elements.
 */
const SidebarMenuLoader = ({ limit = 5 }: LoaderProps): JSX.Element => {
  return (
    <ul className="flex w-full flex-row gap-2 overflow-hidden py-3 text-base md:max-w-41.25 md:flex-col md:gap-5 md:py-0">
      {Array.from(Array(limit).keys()).map((item) => (
        <li key={item} className={`group flex h-5 justify-start gap-3 pr-5`}>
          {/** Animated loader for the icon placeholder */}
          <div className="animate-loader my-auto aspect-square size-5 shrink-0" />
          {/** Animated loader for the text placeholder */}
          <div className={'animate-loader h-5 min-w-full'} />
        </li>
      ))}
    </ul>
  );
};

export default SidebarMenuLoader;
