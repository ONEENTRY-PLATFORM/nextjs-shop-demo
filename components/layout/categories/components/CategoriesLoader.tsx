import type { FC } from 'react';

import type { LoaderProps } from '@/app/types/global';

/**
 * Categories loader animations
 * @param limit
 *
 * @returns Categories loader with animations
 */
export const CategoriesLoader: FC<LoaderProps> = ({ limit = 4 }) => {
  return (
    <div className="flex w-full flex-wrap justify-between gap-5 max-md:flex-col">
      {Array.from(Array(limit).keys()).map((item) => (
        <div
          key={item}
          className="relative flex w-1/4 grow flex-col justify-center max-md:w-full"
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
