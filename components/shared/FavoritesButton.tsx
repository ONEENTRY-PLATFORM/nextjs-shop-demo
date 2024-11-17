'use client';

import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { IUserEntity } from 'oneentry/dist/users/usersInterfaces';
import type { FC } from 'react';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import {
  onSubscribeEvents,
  onUnsubscribeEvents,
} from '@/app/api/hooks/useEvents';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { AuthContext } from '@/app/store/providers/AuthContext';
import {
  addFavorites,
  removeFavorites,
  selectIsFavorites,
} from '@/app/store/reducers/FavoritesSlice';

import HeartIcon from '../icons/heart';
import HeartOpenIcon from '../icons/heart-o';

/**
 * Favorites button
 * @param product product entity object.
 * @returns Favorites button
 */
const FavoritesButton: FC<IProductsEntity> = (product) => {
  const [isFav, setIsFav] = useState(false);
  const dispatch = useAppDispatch();
  const { user, isAuth } = useContext(AuthContext);
  const { id } = product;
  const isFavorites = useAppSelector((state) => selectIsFavorites(state, id));

  /**
   * Update favorites
   */
  const onUpdateFavoritesHandle = () => {
    if (isFav) {
      dispatch(removeFavorites(product.id));
      toast(
        'Product ' + product.localizeInfos.title + ' removed from Favorites!',
      );
    } else {
      dispatch(addFavorites(product.id));
      toast('Product ' + product.localizeInfos.title + ' added to Favorites!');
    }
  };

  /**
   * Update user data favorites
   * @async
   */
  const onUpdateUserFavoritesHandle = async () => {
    try {
      if (!isFav) {
        dispatch(addFavorites(product.id));
        await onSubscribeEvents(product.id);

        toast('Product ' + product.localizeInfos.title + ' add to Favorites!');
      } else {
        dispatch(removeFavorites(product.id));
        await onUnsubscribeEvents(product.id);

        toast(
          'Product ' + product.localizeInfos.title + ' removed from Favorites!',
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      toast('Auth error! ' + e?.message);
    }
  };

  // set Favorites on data change
  useEffect(() => {
    setIsFav(isFavorites);
  }, [isFavorites]);

  if (!product) {
    return;
  }

  return (
    <button
      type="button"
      className="group relative ml-auto box-border flex size-[26px] shrink-0 flex-col items-center justify-center"
      onClick={() => {
        if (user && isAuth && (user as IUserEntity).id) {
          onUpdateUserFavoritesHandle();
        } else {
          onUpdateFavoritesHandle();
        }
      }}
    >
      {isFav ? <HeartIcon /> : <HeartOpenIcon />}
    </button>
  );
};

export default FavoritesButton;
