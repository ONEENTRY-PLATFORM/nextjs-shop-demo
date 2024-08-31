'use client';

import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import { Suspense } from 'react';

import { useAppSelector } from '@/app/store/hooks';
import { selectFavoritesItems } from '@/app/store/reducers/FavoritesSlice';
import ProductsGridLayout from '@/components/layout/catalog/ProductsGridLayout';
import Loader from '@/components/shared/Loader';

const FavoritesPage = () => {
  const favorites = useAppSelector((state) =>
    selectFavoritesItems(state),
  ) as Array<IProductsEntity>;
  const { empty_favorites_plug } = useAppSelector(
    (state) => state.systemContentReducer.content,
  );

  return favorites.length > 0 ? (
    <div className="flex flex-col pb-5 max-md:max-w-full">
      <Suspense fallback={<Loader />}>
        <ProductsGridLayout gridItems={favorites} />
      </Suspense>
    </div>
  ) : (
    <div className="relative box-border flex shrink-0 flex-col">
      {empty_favorites_plug}
    </div>
  );
};

export default FavoritesPage;
