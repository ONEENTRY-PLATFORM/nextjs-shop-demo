'use client';

import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';
import { Suspense } from 'react';

import { useAppSelector } from '@/app/store/hooks';
import { selectFavoritesItems } from '@/app/store/reducers/FavoritesSlice';
import ProductsGridLayout from '@/components/layout/catalog/ProductsGridLayout';
import EmptyFavorites from '@/components/layout/favorites/EmptyFavorites';
import { ProductsGridLoader } from '@/components/shared/Loader';

const FavoritesPage: FC<{ lang: string }> = ({ lang }) => {
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
          total={favorites.length}
        />
      </Suspense>
    </div>
  ) : (
    <EmptyFavorites lang={lang} />
  );
};

export default FavoritesPage;
