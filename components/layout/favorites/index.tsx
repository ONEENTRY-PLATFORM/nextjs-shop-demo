/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { IUserEntity } from 'oneentry/dist/users/usersInterfaces';
import type { Key } from 'react';
import { type FC, useContext, useEffect } from 'react';

import { useGetProductsByIds } from '@/app/api/hooks/useGetProductsByIds';
import { updateUserState } from '@/app/api/server/users/updateUserState';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { AuthContext } from '@/app/store/providers/AuthContext';
import { selectCartItems } from '@/app/store/reducers/CartSlice';
import {
  addFavorites,
  selectFavoritesItems,
} from '@/app/store/reducers/FavoritesSlice';
import type { SimplePageProps } from '@/app/types/global';
import EmptyFavorites from '@/components/layout/favorites/EmptyFavorites';

import ProductCard from '../products-grid/components/product-card/ProductCard';
import FavoriteCard from './FavoriteCard';

const FavoritesPage: FC<SimplePageProps> = ({ lang, dict }) => {
  const { user, isAuth } = useContext(AuthContext);
  const dispatch = useAppDispatch();
  const favoritesIds = useAppSelector(
    (state: { favoritesReducer: { products: number[] } }) =>
      selectFavoritesItems(state),
  ) as Array<number>;
  const productsInCart = useAppSelector(selectCartItems);

  useEffect(() => {
    if (!isAuth || !user || !user.state) {
      return;
    }
    user.state.favorites.forEach((element: number) => {
      dispatch(addFavorites(element));
    });
  }, [isAuth]);

  useEffect(() => {
    if (!isAuth || !user || !user.state) {
      return;
    }
    async function updateUser(favoritesIds: number[], user: IUserEntity) {
      await updateUserState({
        cart: productsInCart,
        favorites: favoritesIds,
        user: user,
      });
    }
    updateUser(favoritesIds, user as IUserEntity);
  }, [favoritesIds]);

  if (favoritesIds.length < 1) {
    return <EmptyFavorites lang={lang} dict={dict} />;
  }

  return (
    favoritesIds.length && (
      <div className="flex flex-col pb-5 max-md:max-w-full">
        <div className={'relative box-border flex w-full shrink-0 flex-col'}>
          <section className="relative mx-auto box-border flex min-h-[100px] w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
            <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 max-md:w-full">
              {favoritesIds.map((productId: number, index: Key | number) => {
                return (
                  <FavoriteCard
                    key={index}
                    lang={lang}
                    dict={dict}
                    productId={productId}
                    index={index as number}
                  />
                );
              })}
            </div>
          </section>
        </div>
      </div>
    )
  );
};

export default FavoritesPage;
