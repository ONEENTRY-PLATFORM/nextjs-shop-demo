'use client';

import type { JSX } from 'react';

import type { LoaderProps } from '@/app/types/global';

/**
 * SidebarMenuLoader.
 * @param   {LoaderProps} props       - SidebarMenu props object.
 * @param   {number}      props.limit - The number of menu items to display.
 * @returns {JSX.Element}             Sidebar menu loader.
 */
const SidebarMenuLoader = ({ limit = 5 }: LoaderProps): JSX.Element => {
  return (
    <ul className="flex w-full flex-row gap-2 overflow-hidden py-3 text-base md:max-w-[165px] md:flex-col md:gap-5 md:py-0">
      {Array.from(Array(limit).keys()).map((item) => (
        <li key={item} className={`group flex h-5 justify-start gap-3 pr-5`}>
          <div className="animate-loader my-auto aspect-square size-5 shrink-0" />
          <div className={'animate-loader h-5 min-w-full'} />
        </li>
      ))}
    </ul>
  );
};

export default SidebarMenuLoader;
