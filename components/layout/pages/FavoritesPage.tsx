'use client';

import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import { Suspense } from 'react';

import { useAppSelector } from '@/app/store/hooks';
import { selectFavoritesItems } from '@/app/store/reducers/FavoritesSlice';
import ProductsGridLayout from '@/components/layout/catalog/ProductsGridLayout';

const FavoritesPage = () => {
  const favorites = useAppSelector((state) =>
    selectFavoritesItems(state),
  ) as Array<IProductsEntity>;

  return (
    <div className="flex flex-col pb-5 max-md:max-w-full">
      <Suspense
        fallback={
          <div className="relative aspect-square size-full max-h-[550px] overflow-hidden" />
        }
      >
        <ProductsGridLayout gridItems={favorites} />
      </Suspense>
    </div>
  );
};

export default FavoritesPage;
