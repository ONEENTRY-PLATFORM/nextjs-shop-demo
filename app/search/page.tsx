'use client';

import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import { Suspense } from 'react';

import ProductsGridLayout from '@/components/layout/catalog/ProductsGridLayout';

import { useGetProducts } from '../api/hooks/useGetProducts';

export default function SearchPage({ params }: { params: { page: string } }) {
  console.log(params);

  // const products = await getPages('en_US');
  // const data = useGetProducts({
  //   // pageUrl,
  //   // offset,
  //   // filters,
  //   // limit,
  //   // searchValue,
  //   // sortKey,
  //   // sortOrder,
  //   // availability,
  //   // disableLoading,
  // }) as {
  //   products: IProductsEntity[];
  //   loading: boolean;
  //   refetch: () => void;
  // };

  return (
    <section className="relative mx-auto box-border flex w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
      <div className="flex w-full flex-col items-center gap-5 bg-white">
        <Suspense
          fallback={
            <div className="relative aspect-square size-full max-h-[550px] overflow-hidden" />
          }
        >
          {/* <ProductsGridLayout gridItems={data.products} /> */}
        </Suspense>
      </div>
    </section>
  );
}
