'use client';

import type { Key } from 'react';
import { type FC, Suspense, useContext, useEffect } from 'react';

import { updateUserState } from '@/app/api/server/users/updateUserState';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { AuthContext } from '@/app/store/providers/AuthContext';
import {
  addFavorites,
  selectFavoritesItems,
} from '@/app/store/reducers/FavoritesSlice';
import type { SimplePageProps } from '@/app/types/global';
import EmptyFavorites from '@/components/layout/favorites/EmptyFavorites';
import Loader from '@/components/shared/Loader';

import FavoriteCard from './FavoriteCard';

const FavoritesPage: FC<SimplePageProps> = ({ lang, dict }) => {
  const { user, isAuth } = useContext(AuthContext);
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(
    (state: { favoritesReducer: { products: number[] } }) =>
      selectFavoritesItems(state),
  ) as Array<number>;

  useEffect(() => {
    if (!isAuth || !user) {
      return;
    }
    async function updateUser(favorites: number[]) {
      await updateUserState({
        favorites: favorites,
        user: user,
      });
    }

    user.state.favorites.forEach((element: number) => {
      dispatch(addFavorites(element));
    });
    updateUser([...user.state.favorites, ...favorites]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuth]);

  return favorites.length ? (
    <div className="flex flex-col pb-5 max-md:max-w-full">
      <div className={'relative box-border flex w-full shrink-0 flex-col'}>
        <section className="relative mx-auto box-border flex min-h-[100px] w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
          <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 max-md:w-full">
            {favorites.map((favoriteId: number, index: Key | number) => {
              return (
                <Suspense fallback={<Loader />} key={index}>
                  <FavoriteCard
                    favoriteId={favoriteId}
                    index={index as number}
                    lang={lang}
                    dict={dict}
                  />
                </Suspense>
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
