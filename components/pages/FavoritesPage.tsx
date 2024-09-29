'use client';

import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';
import { Suspense } from 'react';

import { useAppSelector } from '@/app/store/hooks';
import { selectFavoritesItems } from '@/app/store/reducers/FavoritesSlice';
import ProductsGridLayout from '@/components/layout/catalog/ProductsGridLayout';
import EmptyFavorites from '@/components/layout/favorites/EmptyFavorites';
import { ProductsGridLoader } from '@/components/shared/Loader';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FavoritesPage: FC<{ page: IPagesEntity; lang: string; dict: any }> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  page,
  lang,
  dict,
}) => {
  const favorites = useAppSelector((state) =>
    selectFavoritesItems(state),
  ) as Array<IProductsEntity>;

  return favorites.length ? (
    <div className="flex flex-col pb-5 max-md:max-w-full">
      <Suspense fallback={<ProductsGridLoader />}>
        <ProductsGridLayout
          gridItems={favorites}
          totalPages={0}
          lang={lang}
          dict={dict}
        />
      </Suspense>
    </div>
  ) : (
    <EmptyFavorites />
  );
};

export default FavoritesPage;
