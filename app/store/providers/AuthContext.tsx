/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import type { IUserEntity } from 'oneentry/dist/users/usersInterfaces';
import type { ReactNode } from 'react';
import { createContext, useEffect, useState } from 'react';

import { reDefine, useLazyGetMeQuery } from '@/app/api';
import { updateUserState } from '@/app/api/server/users/updateUserState';
import type { IProducts } from '@/app/types/global';

import { useAppDispatch, useAppSelector } from '../hooks';
import {
  addProductToCart,
  selectCartData,
  selectCartVersion,
  setCartVersion,
} from '../reducers/CartSlice';
import {
  addFavorites,
  selectFavoritesItems,
  selectFavoritesVersion,
  setFavoritesVersion,
} from '../reducers/FavoritesSlice';

type ContextProps = {
  isAuth: boolean;
  isLoading: boolean;
  userToken?: string;
  user?: IUserEntity;
  authenticate: () => void;
  refreshUser: () => void;
};

type AuthProviderProps = {
  children: ReactNode;
  langCode: string;
};

export const AuthContext = createContext<ContextProps>({
  isAuth: false,
  isLoading: false,
  authenticate: () => {},
  refreshUser: () => {},
});

/**
 * Auth provider
 * @param children children ReactNode
 * @param langCode current language code
 *
 * @returns AuthContext Provider
 */
export const AuthProvider = ({ children, langCode }: AuthProviderProps) => {
  const dispatch = useAppDispatch();
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<IUserEntity | undefined>();
  const [refetch, setRefetch] = useState<boolean>(false);
  const [refetchUser, setRefetchUser] = useState<boolean>(false);
  /**
   * Get user data from redux AppSelector
   */
  const cartVersion = useAppSelector(selectCartVersion) as number;
  const favoritesVersion = useAppSelector(selectFavoritesVersion) as number;
  const productsInCart = useAppSelector(selectCartData);
  const favoritesIds = useAppSelector(
    (state: { favoritesReducer: { products: number[] } }) =>
      selectFavoritesItems(state),
  );

  /**
   * Check user data loop
   */
  const [trigger, { isError }] = useLazyGetMeQuery({
    pollingInterval: isAuth ? 3000 : 0,
  });

  /**
   * Initialize authorization
   * @async
   */
  const onInit = async () => {
    const refresh = localStorage.getItem('refresh-token');

    if (!refresh) {
      setIsAuth(false);
      return;
    }
    await reDefine(refresh, langCode);
    await checkToken();
  };

  /**
   * Check refresh token
   * @async
   */
  const checkToken = async () => {
    trigger({
      langCode,
    })
      .then(async (res) => {
        if ((res.isError && !res.isLoading) || !res.data?.id) {
          localStorage.setItem('refresh-token', '');
          setIsAuth(false);
        } else {
          setUser(res.data);
          setIsAuth(true);
        }
      })
      .catch(async () => {
        localStorage.setItem('refresh-token', '');
        setIsAuth(false);
      });
  };

  /**
   * Update user state on server
   * @async
   */
  const updateUser = async () => {
    await updateUserState({
      cart: productsInCart,
      favorites: favoritesIds,
      user: user,
    });
  };

  // Update user data on auth
  useEffect(() => {
    if (!isAuth) {
      return;
    }
    updateUser();
  }, [isAuth, productsInCart, favoritesIds]);

  // Load cart from user state
  useEffect(() => {
    if (!user?.state.cart || cartVersion > 0) {
      return;
    }
    user.state.cart?.forEach((product: IProducts) => {
      dispatch(
        addProductToCart({ id: product.id, selected: true, quantity: 1 }),
      );
    });
    dispatch(setCartVersion(1));
  }, [isAuth, user]);

  // Load favorites from user state
  useEffect(() => {
    if (!user?.state.favorites || favoritesVersion > 0) {
      return;
    }
    user.state.favorites.forEach((element: number) => {
      dispatch(addFavorites(element));
    });
    dispatch(setFavoritesVersion(1));
  }, [isAuth, user]);

  // Refetch
  useEffect(() => {
    setIsLoading(true);
    onInit().then(() => {
      setIsLoading(false);
    });
  }, [refetch, langCode]);

  // Refetch if error and has refresh-token
  useEffect(() => {
    const refresh = localStorage.getItem('refresh-token');
    if (isError && refresh) {
      setRefetch(true);
      localStorage.setItem('refresh-token', '');
      setIsAuth(false);
    }
  }, [isError]);

  // Check token on refetch
  useEffect(() => {
    if (isAuth) {
      checkToken();
    }
  }, [refetch, refetchUser]);

  const value = {
    isAuth,
    isLoading,
    user,
    authenticate: () => setRefetch(!refetch),
    refreshUser: () => setRefetchUser(!refetchUser),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
