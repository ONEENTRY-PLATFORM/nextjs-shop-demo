'use client';

import type { FC } from 'react';

import type { LoaderProps } from '@/app/types/global';

import ProductsGridLoaderAnimations from '../animations/ProductsGridLoaderAnimations';

/**
 * ProductsGridLoader
 * @param limit
 *
 * @returns ProductsGridLoader
 */
const ProductsGridLoader: FC<LoaderProps> = ({ limit = 10 }) => {
  return (
    <ProductsGridLoaderAnimations
      className={'relative box-border flex w-full shrink-0 flex-col'}
    >
      <section className="relative mx-auto box-border flex min-h-[100px] w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
        <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 max-md:w-full">
          {Array.from(Array(limit).keys()).map((item) => (
            <div
              key={item}
              className={
                'product-card relative flex size-full min-h-[360px] flex-col items-center rounded-3xl bg-slate-100 p-4 opacity-40'
              }
            >
              <div className="relative mb-3 size-36 w-full rounded-md bg-white opacity-40"></div>
              <div className="z-10 mb-4 mt-auto flex h-6 w-full flex-col rounded-full bg-white opacity-30"></div>
              <div className="z-10 mb-2 mt-auto flex h-4 w-full flex-col gap-2.5 rounded-full bg-white opacity-30"></div>
              <div className="z-10 mb-2 mt-auto flex h-4 w-full flex-col gap-2.5 rounded-full bg-white opacity-30"></div>
              <div className="z-10 mb-4 mt-auto flex h-8 w-full flex-col gap-2.5 rounded-full bg-white opacity-30"></div>
            </div>
          ))}
        </div>
        <div className="mt-5 flex h-8 w-full"></div>
      </section>
    </ProductsGridLoaderAnimations>
  );
};

export default ProductsGridLoader;
