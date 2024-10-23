/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';

import { useAppSelector } from '@/app/store/hooks';
import { selectFavoritesItems } from '@/app/store/reducers/FavoritesSlice';
import type { SimplePageProps } from '@/app/types/global';
import EmptyFavorites from '@/components/layout/favorites/EmptyFavorites';
import CardsGridAnimations from '@/components/layout/products-grid/animations/CardsGridAnimations';
import ProductCard from '@/components/layout/products-grid/components/product-card/ProductCard';

const FavoritesPage: FC<SimplePageProps> = ({ lang, dict }) => {
  const favorites = useAppSelector(
    (state: { favoritesReducer: { products: unknown[] } }) =>
      selectFavoritesItems(state),
  ) as Array<IProductsEntity & { selected: boolean }>;

  return favorites.length ? (
    <div className="flex flex-col pb-5 max-md:max-w-full">
      <CardsGridAnimations
        className={'relative box-border flex w-full shrink-0 flex-col'}
      >
        <section className="relative mx-auto box-border flex min-h-[100px] w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
          <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 max-md:w-full">
            {favorites?.map((favorite, index) => {
              if (!favorite.isVisible) {
                return;
              }
              return (
                <ProductCard
                  key={favorite.id}
                  product={favorite}
                  lang={lang}
                  index={index}
                  dict={dict}
                />
              );
            })}
          </div>
        </section>
      </CardsGridAnimations>
    </div>
  ) : (
    <EmptyFavorites lang={lang} dict={dict} />
  );
};

export default FavoritesPage;
