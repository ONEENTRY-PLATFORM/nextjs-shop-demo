/* eslint-disable @typescript-eslint/no-unused-vars */
import type { FC } from 'react';
import React from 'react';

import SearchIcon from '@/components/icons/search';

import Spinner from './Spinner';

interface LoaderProps {
  data?: Record<string, unknown>;
  limit?: number;
  offset?: number;
}

const Loader: FC<LoaderProps> = ({ data = {} }) => {
  return (
    <div className="relative aspect-square size-full max-h-[250px] overflow-hidden">
      <Spinner />
    </div>
  );
};

export const CategoriesLoader: FC<LoaderProps> = ({
  data = {},
  limit = 10,
}) => {
  return (
    <div className="flex w-full flex-wrap justify-between gap-5 max-md:flex-col">
      {Array.from(Array(4).keys()).map((item) => (
        <div
          key={item}
          className="relative flex w-1/4 grow flex-col justify-center text-2xl font-bold text-white max-md:w-full"
        >
          <div
            className={`relative flex size-full h-64 overflow-hidden rounded-3xl p-6`}
          >
            <h2 className="animate-loader z-10 mt-auto uppercase text-transparent">
              xxx
            </h2>
            <div className="animate-loader size-full rounded-3xl" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const ProductsGridLoader: FC<LoaderProps> = ({
  data = {},
  limit = 10,
}) => {
  const cls =
    'relative flex size-full flex-col min-h-[360px] items-center rounded-3xl animate-loader p-4';

  return (
    <div className="relative box-border flex w-full shrink-0 flex-col">
      <section className="relative mx-auto box-border flex min-h-[100px] w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
        <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 max-md:w-full">
          {Array.from(Array(limit).keys()).map((item) => (
            <div key={item} className={cls} />
          ))}
        </div>
        <div className="mt-5 flex w-full justify-center">
          {/* <Pagination totalPages={totalPages} /> */}
        </div>
      </section>
    </div>
  );
};

export const OrdersListLoader: FC<LoaderProps> = ({
  data = {},
  limit = 10,
}) => {
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

export const SearchBarLoader: FC<LoaderProps> = ({ data = {}, limit = 10 }) => {
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

export const SidebarMenuLoader: FC<LoaderProps> = ({
  data = {},
  limit = 10,
}) => {
  return (
    <div>
      <ul className="flex w-full flex-row gap-2 overflow-hidden py-3 text-base md:max-w-[165px] md:flex-col md:gap-5 md:py-0">
        {Array.from(Array(5).keys()).map((item) => (
          <li key={item} className={`group flex h-5 justify-start gap-3 pr-5`}>
            <div className="animate-loader my-auto aspect-square size-5 shrink-0" />
            <div className={'animate-loader h-5 min-w-full'} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export const NavMenuLoader: FC<LoaderProps> = ({ data = {}, limit = 10 }) => {
  return (
    <div className="my-auto flex gap-5 max-md:max-w-full">
      {Array.from(Array(3).keys()).map((item) => (
        <div
          key={item}
          className="animate-loader relative box-border flex size-6 shrink-0"
        ></div>
      ))}
    </div>
  );
};

export const OrdersTableLoader: FC<LoaderProps> = ({
  data = {},
  limit = 10,
}) => {
  return (
    <div className="my-auto flex w-full flex-col max-md:max-w-full">
      {Array.from(Array(3).keys()).map((item) => (
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
