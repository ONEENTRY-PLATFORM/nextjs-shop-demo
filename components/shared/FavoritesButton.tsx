/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { IUserEntity } from 'oneentry/dist/users/usersInterfaces';
import type { JSX } from 'react';
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
 * Favorites button.
 * @param   {object}          props         - Favorites button properties.
 * @param   {IProductsEntity} props.product - product entity object.
 * @returns {JSX.Element}                   Favorites button.
 */
const FavoritesButton = memo((product: IProductsEntity): JSX.Element => {
  const [isFav, setIsFav] = useState(false);
  const dispatch = useAppDispatch();
  const { user, isAuth } = useContext(AuthContext);
  const { id, localizeInfos } = product;
  const isFavorites = useAppSelector((state) =>
    selectIsFavorites(state as any, id),
  );

  /**
   * Update favorites state and display notification.
   *
   * This function toggles the favorite status of a product:
   * - If the product is currently marked as favorite, it removes it from favorites
   * - If the product is not currently marked as favorite, it adds it to favorites
   *
   * It also displays a toast notification confirming the action performed.
   *
   * Dependencies:
   * - isFav: Current favorite status of the product
   * - dispatch: Redux dispatch function to trigger add/remove favorite actions
   * - id: Product identifier
   * - localizeInfos?.title: Product title for the notification message
   */
  const onUpdateFavoritesHandle = useCallback(() => {
    if (isFav) {
      dispatch(removeFavorites(id));
      toast('Product ' + localizeInfos?.title + ' removed from Favorites!');
    } else {
      dispatch(addFavorites(id));
      toast('Product ' + localizeInfos?.title + ' added to Favorites!');
    }
  }, [isFav, dispatch, id, localizeInfos?.title]);

  /** Update user data favorites. */
  const onUpdateUserFavoritesHandle = useCallback(async () => {
    try {
      if (!isFav) {
        dispatch(addFavorites(id));
        if (user && isAuth) {
          await onSubscribeEvents(id);
        }

        toast('Product ' + localizeInfos?.title + ' add to Favorites!');
      } else {
        dispatch(removeFavorites(id));
        if (user && isAuth) {
          await onUnsubscribeEvents(id);
        }

        toast('Product ' + localizeInfos?.title + ' removed from Favorites!');
      }
    } catch (e: any) {
      toast('Auth error! ' + e?.message);
    }
  }, [isFav, user, isAuth, dispatch, id, localizeInfos?.title]);

  /** Handle click. */
  const handleClick = useCallback(() => {
    if (user && isAuth && (user as IUserEntity).id) {
      onUpdateUserFavoritesHandle();
    } else {
      onUpdateFavoritesHandle();
    }
  }, [user, isAuth, onUpdateUserFavoritesHandle, onUpdateFavoritesHandle]);

  /** Set favorites on data change. */
  useEffect(() => {
    setIsFav(isFavorites);
  }, [isFavorites]);

  if (!product) {
    return <></>;
  }

  return (
    <button
      type="button"
      className="group cursor-pointer relative ml-auto box-border flex size-6.5 shrink-0 flex-col items-center justify-center"
      onClick={handleClick}
      aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isFav ? <HeartIcon /> : <HeartOpenIcon />}
    </button>
  );
});

FavoritesButton.displayName = 'FavoritesButton';

export default FavoritesButton;
