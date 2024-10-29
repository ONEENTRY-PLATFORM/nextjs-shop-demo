/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC, Key } from 'react';

import FadeTransition from '@/app/animations/FadeTransition';
import { useGetProductsByIds } from '@/app/api/hooks/useGetProductsByIds';
import { useAppSelector } from '@/app/store/hooks';
import { selectFavoritesItems } from '@/app/store/reducers/FavoritesSlice';
import type { SimplePageProps } from '@/app/types/global';
import EmptyFavorites from '@/components/layout/favorites/EmptyFavorites';

import ProductCard from '../products-grid/components/product-card/ProductCard';
import ProductsGridLoader from '../products-grid/components/ProductsGridLoader';

const FavoritesPage: FC<SimplePageProps> = ({ lang, dict }) => {
  const favoritesIds = useAppSelector(
    (state: { favoritesReducer: { products: number[] } }) =>
      selectFavoritesItems(state),
  ) as Array<number>;

  const { products, isLoading } = useGetProductsByIds({ items: favoritesIds });

  if (products.length < 1) {
    if (isLoading) {
      return <ProductsGridLoader />;
    } else {
      return <EmptyFavorites lang={lang} dict={dict} />;
    }
  }

  return (
    products.length && (
      <FadeTransition className="flex flex-col pb-5 max-md:max-w-full">
        <div className={'relative box-border flex w-full shrink-0 flex-col'}>
          <section className="relative mx-auto box-border flex min-h-[100px] w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
            <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 max-md:w-full">
              {products.map((product: IProductsEntity, index: Key | number) => {
                return (
                  <ProductCard
                    key={index}
                    product={product}
                    index={index as number}
                    lang={lang}
                    dict={dict}
                  />
                );
              })}
            </div>
          </section>
        </div>
      </FadeTransition>
    )
  );
};

export default FavoritesPage;
