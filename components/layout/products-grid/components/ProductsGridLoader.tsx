'use client';

import type { FC, JSX } from 'react';

import type { LoaderProps } from '@/app/types/global';

import ProductsGridLoaderAnimations from '../animations/ProductsGridLoaderAnimations';

/**
 * ProductsGridLoader component displays a loading skeleton for the products grid.
 * It renders placeholder cards with a pulsing animation while the actual product data is being fetched.
 * This provides a better user experience by showing content layout before the real data loads.
 * @param   {LoaderProps} props       - Component properties
 * @param   {number}      props.limit - Number of placeholder cards to render (defaults to 10)
 * @returns {JSX.Element}             A section containing animated placeholder cards for products
 */
const ProductsGridLoader: FC<LoaderProps> = ({
  limit = 10,
}: LoaderProps): JSX.Element => {
  return (
    // Wrapper with animation for the entire loader component
    <ProductsGridLoaderAnimations
      className={'relative box-border flex w-full shrink-0 flex-col'}
    >
      {/* Main section container with max width constraint */}
      <section className="relative mx-auto box-border flex min-h-25 w-full max-w-(--breakpoint-xl) shrink-0 grow flex-col self-stretch">
        {/* Grid container with responsive columns, matching the actual products grid */}
        <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 max-md:w-full">
          {/* Generate an array of placeholder cards based on the limit prop */}
          {Array.from(Array(limit).keys()).map((item) => (
            // Individual product card placeholder with styling similar to actual product cards
            <div
              key={item}
              className={
                'product-card relative flex size-full min-h-90 flex-col items-center rounded-3xl bg-slate-100 p-4 opacity-40'
              }
            >
              {/* Product image placeholder */}
              <div className="relative mb-3 size-36 w-full rounded-md bg-white opacity-40"></div>
              {/* Product title placeholder */}
              <div className="z-10 mb-4 mt-auto flex h-6 w-full flex-col rounded-full bg-white opacity-30"></div>
              {/* Product attribute line 1 placeholder */}
              <div className="z-10 mb-2 mt-auto flex h-4 w-full flex-col gap-2.5 rounded-full bg-white opacity-30"></div>
              {/* Product attribute line 2 placeholder */}
              <div className="z-10 mb-2 mt-auto flex h-4 w-full flex-col gap-2.5 rounded-full bg-white opacity-30"></div>
              {/* Product price/action button placeholder */}
              <div className="z-10 mb-4 mt-auto flex h-8 w-full flex-col gap-2.5 rounded-full bg-white opacity-30"></div>
            </div>
          ))}
        </div>
        {/* Spacer element to maintain consistent spacing */}
        <div className="mt-5 flex h-8 w-full"></div>
      </section>
    </ProductsGridLoaderAnimations>
  );
};

export default ProductsGridLoader;
