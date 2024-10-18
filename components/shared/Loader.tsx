'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import type { FC } from 'react';

import { blocksColors, blocksData } from '@/components/data';
import SearchIcon from '@/components/icons/search';

import Spinner from './Spinner';

interface LoaderProps {
  data?: Record<string, unknown>;
  limit?: number;
  offset?: number;
}

const Loader: FC<LoaderProps> = () => {
  return (
    <div className="relative aspect-square size-full max-h-[250px] overflow-hidden">
      <Spinner />
    </div>
  );
};

export const CategoriesLoader: FC<LoaderProps> = ({ limit = 4 }) => {
  return (
    <div className="flex w-full flex-wrap justify-between gap-5 max-md:flex-col">
      {Array.from(Array(limit).keys()).map((item) => (
        <div
          key={item}
          // eslint-disable-next-line tailwindcss/no-custom-classname
          className="box relative flex w-1/4 grow flex-col justify-center max-md:w-full"
        >
          <div
            className={`relative flex size-full h-64 overflow-hidden rounded-3xl p-6`}
          >
            <div className="animate-loader z-10 mt-auto h-6 w-full bg-slate-500 text-2xl font-bold uppercase text-white">
              {''}
            </div>
            <div className="animate-loader absolute left-0 top-0 size-full rounded-3xl bg-slate-500" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const OrdersListLoader: FC<LoaderProps> = ({ limit = 10 }) => {
  const cls =
    'relative flex size-full flex-col min-h-[60px] items-center rounded-3xl animate-loader p-4';

  return (
    <div className="relative box-border flex w-full shrink-0 flex-col">
      {Array.from(Array(limit).keys()).map((item) => (
        <div key={item} className={cls} />
      ))}
    </div>
  );
};

export const SearchBarLoader: FC<LoaderProps> = () => {
  return (
    <div className="relative my-auto ml-24 flex h-[60px] w-fit shrink-0 grow basis-0 flex-row items-center justify-end gap-5 rounded-[30px] border border-solid border-gray-400 bg-white px-7 max-md:ml-0 max-md:h-[50px] max-md:max-w-full max-md:px-5 max-sm:h-[40px] max-sm:gap-0 max-sm:px-4 max-sm:pr-1">
      <div className="flex w-full">
        <div className="group relative ml-auto box-border flex shrink-0 flex-col p-2.5">
          <SearchIcon />
        </div>
      </div>
    </div>
  );
};

export const SidebarMenuLoader: FC<LoaderProps> = ({ limit = 5 }) => {
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

export const VerticalMenuLoader: FC<LoaderProps> = ({ limit = 6 }) => {
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

export const NavMenuLoader: FC<LoaderProps> = ({ limit = 3 }) => {
  return (
    <div className="my-auto flex gap-5 max-md:max-w-full">
      {Array.from(Array(limit).keys()).map((item) => (
        <div
          key={item}
          className="animate-loader relative box-border flex size-6 shrink-0"
        ></div>
      ))}
    </div>
  );
};

export const OrdersTableLoader: FC<LoaderProps> = ({ limit = 10 }) => {
  return (
    <div className="my-auto flex w-full flex-col max-md:max-w-full">
      {Array.from(Array(limit).keys()).map((item) => (
        <div
          key={item}
          className="relative -mb-px flex h-12 border-collapse gap-4 border-y p-4"
        >
          <div className="animate-loader h-full w-1/2"></div>
          <div className="animate-loader h-full w-1/4"></div>
          <div className="animate-loader h-full w-1/4"></div>
        </div>
      ))}
    </div>
  );
};

export default Loader;
