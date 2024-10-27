/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import type { Key } from 'react';
import { type FC, useContext } from 'react';

import { useAppSelector } from '@/app/store/hooks';
import { AuthContext } from '@/app/store/providers/AuthContext';
import { selectFavoritesItems } from '@/app/store/reducers/FavoritesSlice';
import type { SimplePageProps } from '@/app/types/global';
import EmptyFavorites from '@/components/layout/favorites/EmptyFavorites';
import ProductCard from '@/components/layout/products-grid/components/product-card/ProductCard';

const FavoritesPage: FC<SimplePageProps> = ({ lang, dict }) => {
  const { user, isAuth } = useContext(AuthContext);
  const favorites = useAppSelector((state) =>
    selectFavoritesItems(state),
  ) as Array<number>;
  // console.log({ user, isAuth });
  const userFavorites = isAuth && user ? user.state.favorites : favorites;
  // const version = user?.state.version;

  if (!userFavorites) {
    return;
  }

  return userFavorites.length ? (
    <div className="flex flex-col pb-5 max-md:max-w-full">
      <div className={'relative box-border flex w-full shrink-0 flex-col'}>
        <section className="relative mx-auto box-border flex min-h-[100px] w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
          <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 max-md:w-full">
            {userFavorites.map((favoriteId: string | number, index: Key) => {
              if (!favoriteId) {
                return;
              }
              return (
                // <ProductCard
                //   key={index}
                //   product={favorite}
                //   lang={lang}
                //   index={index}
                //   dict={dict}
                // />
                favoriteId
              );
            })}
          </div>
        </section>
      </div>
    </div>
  ) : (
    <EmptyFavorites lang={lang} dict={dict} />
  );
};

export default FavoritesPage;
