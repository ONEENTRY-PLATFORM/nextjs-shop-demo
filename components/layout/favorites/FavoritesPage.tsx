'use client';

import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import { Suspense } from 'react';

import { useAppSelector } from '@/app/store/hooks';
import { selectFavoritesItems } from '@/app/store/reducers/FavoritesSlice';
import ProductsGridLayout from '@/components/layout/catalog/ProductsGridLayout';
import { ProductsGridLoader } from '@/components/shared/Loader';

import EmptyFavorites from './EmptyFavorites';

const FavoritesPage = () => {
  const favorites = useAppSelector((state) =>
    selectFavoritesItems(state),
  ) as Array<IProductsEntity>;

  return favorites.length ? (
    <div className="flex flex-col pb-5 max-md:max-w-full">
      <Suspense fallback={<ProductsGridLoader />}>
        <ProductsGridLayout gridItems={favorites} totalPages={0} />
      </Suspense>
    </div>
  ) : (
    <EmptyFavorites />
  );
};

export default FavoritesPage;
