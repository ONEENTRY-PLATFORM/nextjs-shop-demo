'use client';

import type { FC } from 'react';

import type { LoaderProps } from '@/app/types/global';

const OrdersTableLoader: FC<LoaderProps> = ({ limit = 10 }) => {
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

export default OrdersTableLoader;
