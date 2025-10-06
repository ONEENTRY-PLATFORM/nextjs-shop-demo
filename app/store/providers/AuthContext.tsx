/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import type { IUserEntity } from 'oneentry/dist/users/usersInterfaces';
import type { JSX, ReactNode } from 'react';
import { createContext, useEffect, useState } from 'react';

import {
  // reDefine,
  useLazyGetMeQuery,
} from '@/app/api';
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

/**
 * Authentication context
 * @property {boolean}     isAuth       - Authentication status
 * @property {boolean}     isLoading    - Loading status
 * @property {string}      userToken    - User token
 * @property {IUserEntity} user         - User entity
 * @property {void}        authenticate - Authentication function
 * @property {void}        refreshUser  - User refresh function
 */
export const AuthContext = createContext<{
  isAuth: boolean;
  isLoading: boolean;
  userToken?: string;
  user?: IUserEntity;
  authenticate: () => void;
  refreshUser: () => void;
}>({
  isAuth: false,
  isLoading: false,
  authenticate: () => {},
  refreshUser: () => {},
});

/**
 * Auth provider
 * @param   {object}      props          - Auth provider properties
 * @param   {ReactNode}   props.children - Children ReactNode
 * @param   {string}      props.langCode - Current language code
 * @returns {JSX.Element}                AuthContext Provider
 */
export const AuthProvider = ({
  children,
  langCode,
}: {
  children: ReactNode;
  langCode: string;
}): JSX.Element => {
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
  const [trigger, { isError }] = useLazyGetMeQuery();

  /**
   * Initialize authorization
   */
  const onInit = async (): Promise<void> => {
    const refresh = localStorage.getItem('refresh-token');

    if (!refresh) {
      setIsAuth(false);
      return;
    }
    // await reDefine(refresh, langCode);
    await checkToken();
  };

  /**
   * Check refresh token
   */
  const checkToken = async (): Promise<void> => {
    setIsLoading(true);
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
        setIsLoading(false);
      })
      .catch(async () => {
        localStorage.setItem('refresh-token', '');
        setIsAuth(false);
        setIsLoading(false);
      });
  };

  /**
   * Update user state on server
   */
  const updateUserData = async (): Promise<void> => {
    if (!user) {
      return;
    }
    await updateUserState({
      cart: productsInCart,
      favorites: favoritesIds,
      user: user,
    });
  };

  // Update user data on auth
  useEffect(() => {
    if (!isAuth || !user) {
      return;
    }
    updateUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuth, user, productsInCart, favoritesIds]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuth, user]);

  // Refetch
  useEffect(() => {
    setIsLoading(true);
    onInit().then(() => {
      setIsLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetch, langCode]);

  // Refetch if error and has refresh-token
  useEffect(() => {
    const refresh = localStorage.getItem('refresh-token');
    if (isError && refresh) {
      setRefetch(true);
      // localStorage.setItem('refresh-token', '');
      // setIsAuth(false);
    }
  }, [isError]);

  // Check token on refetch
  useEffect(() => {
    if (isAuth) {
      checkToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetch, refetchUser, isAuth]);

  const value = {
    isAuth,
    isLoading,
    user,
    authenticate: () => setRefetch(!refetch),
    refreshUser: () => setRefetchUser(!refetchUser),
  };

  return (
    <AuthContext.Provider value={value as any}>{children}</AuthContext.Provider>
  );
};
