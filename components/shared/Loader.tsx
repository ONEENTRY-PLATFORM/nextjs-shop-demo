/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

import SearchIcon from '@/components/icons/search';

interface LoaderProps {
  data?: Record<string, unknown>;
  limit?: number;
}

const Loader: React.FC<LoaderProps> = ({ data = {} }) => {
  return (
    <div className="relative aspect-square size-full max-h-[550px] overflow-hidden">
      ...Loading
    </div>
  );
};

export const ProductsGridLoader: React.FC<LoaderProps> = ({
  data = {},
  limit = 10,
}) => {
  const cls =
    'relative flex size-full flex-col min-h-[360px] items-center rounded-3xl bg-neutral-100 p-4';

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

export const OrdersListLoader: React.FC<LoaderProps> = ({
  data = {},
  limit = 10,
}) => {
  const cls =
    'relative flex size-full flex-col min-h-[60px] items-center rounded-3xl bg-neutral-100 p-4';

  return (
    <div className="relative box-border flex w-full shrink-0 flex-col">
      {Array.from(Array(limit).keys()).map((item) => (
        <div key={item} className={cls} />
      ))}
    </div>
  );
};

export const SearchBarLoader: React.FC = () => {
  return (
    <div className="relative my-auto ml-24 flex h-[60px] w-fit shrink-0 grow basis-0 flex-row items-center justify-end gap-5 rounded-[30px] border border-solid border-gray-400 bg-white px-7 max-md:ml-0 max-md:h-[50px] max-md:max-w-full max-md:px-5 max-sm:h-[40px] max-sm:gap-0 max-sm:px-4 max-sm:pr-1">
      <div className="flex w-full">
        <div className="group relative m-auto box-border flex shrink-0 flex-col p-2.5">
          <SearchIcon />
        </div>
      </div>
    </div>
  );
};

export default Loader;
