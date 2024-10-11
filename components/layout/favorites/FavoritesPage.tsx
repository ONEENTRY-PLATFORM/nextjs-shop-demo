'use client';

import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';
import { Suspense } from 'react';

import { useAppSelector } from '@/app/store/hooks';
import { selectFavoritesItems } from '@/app/store/reducers/FavoritesSlice';
import type { SimplePageProps } from '@/app/types/global';
import ProductsGridLayout from '@/components/layout/catalog/ProductsGridLayout';
import EmptyFavorites from '@/components/layout/favorites/EmptyFavorites';
import { ProductsGridLoader } from '@/components/shared/Loader';

const FavoritesPage: FC<SimplePageProps> = ({ lang, dict }) => {
  const favorites = useAppSelector(
    (state: { favoritesReducer: { products: unknown[] } }) =>
      selectFavoritesItems(state),
  ) as Array<IProductsEntity>;

  return favorites.length ? (
    <div className="flex flex-col pb-5 max-md:max-w-full">
      <Suspense fallback={<ProductsGridLoader />}>
        <ProductsGridLayout
          gridItems={favorites}
          totalPages={0}
          lang={lang}
          total={favorites.length}
          dict={dict}
        />
      </Suspense>
    </div>
  ) : (
    <EmptyFavorites lang={lang} />
  );
};

export default FavoritesPage;
