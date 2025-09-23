/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { IUserEntity } from 'oneentry/dist/users/usersInterfaces';
import type { FC } from 'react';
import { memo, useCallback, useContext, useEffect, useState } from 'react';
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
import HeartIcon from '@/components/icons/heart';
import HeartOpenIcon from '@/components/icons/heart-o';

/**
 * Favorites button
 * @param product product entity object.
 * @returns Favorites button
 */
const FavoritesButton: FC<IProductsEntity> = memo((product) => {
  const [isFav, setIsFav] = useState(false);
  const dispatch = useAppDispatch();
  const { user, isAuth } = useContext(AuthContext);
  const { id } = product;
  const isFavorites = useAppSelector((state) =>
    selectIsFavorites(state as any, id),
  );

  /**
   * Update favorites
   */
  const onUpdateFavoritesHandle = useCallback(() => {
    if (isFav) {
      dispatch(removeFavorites(product.id));
      toast(
        'Product ' + product.localizeInfos.title + ' removed from Favorites!',
      );
    } else {
      dispatch(addFavorites(product.id));
      toast('Product ' + product.localizeInfos.title + ' added to Favorites!');
    }
  }, [isFav, dispatch, product.id, product.localizeInfos.title]);

  /**
   * Update user data favorites
   * @async
   */
  const onUpdateUserFavoritesHandle = useCallback(async () => {
    try {
      if (!isFav) {
        dispatch(addFavorites(product.id));
        if (user && isAuth) {
          await onSubscribeEvents(product.id);
        }

        toast('Product ' + product.localizeInfos.title + ' add to Favorites!');
      } else {
        dispatch(removeFavorites(product.id));
        if (user && isAuth) {
          await onUnsubscribeEvents(product.id);
        }

        toast(
          'Product ' + product.localizeInfos.title + ' removed from Favorites!',
        );
      }
    } catch (e: any) {
      toast('Auth error! ' + e?.message);
    }
  }, [isFav, user, isAuth, dispatch, product.id, product.localizeInfos.title]);

  const handleClick = useCallback(() => {
    if (user && isAuth && (user as IUserEntity).id) {
      onUpdateUserFavoritesHandle();
    } else {
      onUpdateFavoritesHandle();
    }
  }, [user, isAuth, onUpdateUserFavoritesHandle, onUpdateFavoritesHandle]);

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
      className="group cursor-pointer relative ml-auto box-border flex size-[26px] shrink-0 flex-col items-center justify-center"
      onClick={handleClick}
      aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isFav ? <HeartIcon /> : <HeartOpenIcon />}
    </button>
  );
});

FavoritesButton.displayName = 'FavoritesButton';

export default FavoritesButton;
