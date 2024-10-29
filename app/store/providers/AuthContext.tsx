/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import type { IUserEntity } from 'oneentry/dist/users/usersInterfaces';
import type { ReactNode } from 'react';
import { createContext, useEffect, useState } from 'react';

import { api, reDefine, useLazyGetMeQuery } from '@/app/api';
import { useNotifications } from '@/app/api/hooks/useNotifications';
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

export const AuthContext = createContext<ContextProps>({
  isAuth: false,
  isLoading: false,
  authenticate: () => {},
  refreshUser: () => {},
});

type AuthProviderProps = {
  children: ReactNode;
  langCode: string;
};

export const AuthProvider = ({ children, langCode }: AuthProviderProps) => {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<IUserEntity | undefined>();
  const [refetch, setRefetch] = useState<boolean>(false);
  const [refetchUser, setRefetchUser] = useState<boolean>(false);

  const [isTokenSet, setIsTokenSet] = useState<boolean>(false);
  const { token } = useNotifications();
  const dispatch = useAppDispatch();
  const cartVersion = useAppSelector(selectCartVersion) as number;
  const favoritesVersion = useAppSelector(selectFavoritesVersion) as number;

  const productsInCart = useAppSelector(selectCartData) as IProducts[];
  const favoritesIds = useAppSelector(
    (state: { favoritesReducer: { products: number[] } }) =>
      selectFavoritesItems(state),
  ) as Array<number>;

  const [trigger, { isError }] = useLazyGetMeQuery({
    pollingInterval: isAuth ? 3000 : 0,
  });

  const onInit = async () => {
    const refresh = localStorage.getItem('refresh-token');
    if (!refresh) {
      setIsAuth(false);
      return;
    }
    await reDefine(refresh, langCode);
    await checkToken();
  };

  const checkToken = async () => {
    trigger({
      langCode,
    })
      .then(async (res) => {
        if ((res.error && !res.isLoading) || !res.data?.id) {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function updateUser() {
    await updateUserState({
      cart: productsInCart,
      favorites: favoritesIds,
      user: user,
    });
  }

  useEffect(() => {
    if (!isAuth) {
      return;
    }
    updateUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuth, productsInCart, favoritesIds]);

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

  // load Favorites from user state
  useEffect(() => {
    if (!user?.state.favorites || favoritesVersion > 0) {
      return;
    }
    user.state.favorites.forEach((element: number) => {
      dispatch(addFavorites(element));
    });
    dispatch(setFavoritesVersion(1));
  }, [isAuth, user]);

  useEffect(() => {
    setIsLoading(true);
    onInit().then(() => {
      setIsLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetch, langCode]);

  useEffect(() => {
    const refresh = localStorage.getItem('refresh-token');
    if (isError && refresh) {
      setRefetch(true);
    }
  }, [isError]);

  useEffect(() => {
    if (isAuth) {
      checkToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetch, refetchUser]);

  useEffect(() => {
    if (token && !isTokenSet && isAuth && user) {
      (async () => {
        try {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const res = await api.Users.addFCMToken(token);
          setIsTokenSet(true);
        } catch (e) {
          console.log('=>(AuthContext.tsx:95) e', e);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, token]);

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const value = {
    isAuth,
    isLoading,
    user,
    authenticate: () => setRefetch(!refetch),
    refreshUser: () => setRefetchUser(!refetchUser),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
