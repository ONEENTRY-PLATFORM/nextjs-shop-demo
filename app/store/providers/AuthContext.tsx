'use client';

import type { IUserEntity } from 'oneentry/dist/users/usersInterfaces';
import type { JSX, ReactNode } from 'react';
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';

import { hasActiveSession, reDefine, useLazyGetMeQuery } from '@/app/api';
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

  /**
   * Monotonic counters used as effect triggers. A counter-based reducer is
   * safer than a boolean toggle — rapid successive calls always produce a new
   * value, whereas `setRefetch(!refetch)` would capture a stale closure value
   * and may collapse two calls into a single re-render.
   */
  const [reinitTick, bumpReinit] = useReducer((n: number) => n + 1, 0);
  const [recheckTick, bumpRecheck] = useReducer((n: number) => n + 1, 0);

  const cartVersion = useAppSelector(selectCartVersion) as number;
  const favoritesVersion = useAppSelector(selectFavoritesVersion) as number;
  const productsInCart = useAppSelector(selectCartData);
  const favoritesIds = useAppSelector(
    (state: { favoritesReducer: { products: number[] } }) =>
      selectFavoritesItems(state),
  );

  const [trigger, { isError }] = useLazyGetMeQuery({
    pollingInterval: isAuth ? 30000 : 0,
  });

  /**
   * Re-fetches the current user via RTK Query and updates auth state.
   * Memoized so it can be safely listed as an effect dep.
   * @returns {Promise<void>} Resolves once auth state is reconciled.
   */
  const checkToken = useCallback(async (): Promise<void> => {
    const refresh = localStorage.getItem('refresh-token');
    if (!refresh) {
      setIsAuth(false);
      return;
    }
    try {
      const res = await trigger({ langCode });
      if ((res.isError && !res.isLoading) || !res.data?.id) {
        setIsAuth(false);
      } else {
        setUser(res.data);
        setIsAuth(true);
      }
    } catch {
      setIsAuth(false);
    }
  }, [langCode, trigger]);

  /**
   * Always-current ref to {@link checkToken}. Used by the manual-recheck
   * effect below so a `langCode` change does not double-fire it (the init
   * effect already covers the lang-change path).
   */
  const checkTokenRef = useRef(checkToken);
  useEffect(() => {
    checkTokenRef.current = checkToken;
  }, [checkToken]);

  /** Push the latest cart and favorites to the server when they change. */
  useEffect(() => {
    if (!isAuth || !user) {
      return;
    }
    updateUserState({
      cart: productsInCart,
      favorites: favoritesIds,
    });
  }, [isAuth, user, productsInCart, favoritesIds]);

  /** Hydrate the cart in Redux from the user's stored state on first auth. */
  useEffect(() => {
    if (!user?.state.cart || cartVersion > 0) {
      return;
    }
    (user.state.cart as IProducts[] | undefined)?.forEach(
      (product: IProducts) => {
        const productInCart = productsInCart?.find((p) => p.id === product.id);
        if (!productInCart) {
          dispatch(addProductToCart(product));
        }
      },
    );
    dispatch(setCartVersion(1));
  }, [isAuth, user, cartVersion, productsInCart, dispatch]);

  /** Hydrate favorites in Redux from the user's stored state on first auth. */
  useEffect(() => {
    if (!user?.state.favorites || favoritesVersion > 0) {
      return;
    }
    (user.state.favorites as number[]).forEach((element: number) => {
      dispatch(addFavorites(element));
    });
    dispatch(setFavoritesVersion(1));
  }, [isAuth, user, favoritesVersion, dispatch]);

  /**
   * Full re-init: read the refresh token from localStorage, sync the SDK,
   * then verify the token. Re-runs on `reinitTick` (login/logout) or langCode.
   */
  useEffect(() => {
    let cancelled = false;
    const initAuth = async () => {
      if (!cancelled) setIsLoading(true);

      const refresh = localStorage.getItem('refresh-token');
      if (!refresh) {
        if (!cancelled) {
          setIsAuth(false);
          setIsLoading(false);
        }
        return;
      }
      if (!hasActiveSession()) {
        await reDefine(refresh, langCode);
      }
      if (!cancelled) {
        await checkToken();
        if (!cancelled) setIsLoading(false);
      }
    };
    initAuth();
    return () => {
      cancelled = true;
    };
  }, [reinitTick, langCode, checkToken]);

  /**
   * Drop auth on RTK Query polling errors (e.g. expired session).
   * setState-in-effect is intentional: this reacts to a derived change in the
   * polling result, not to a user-driven event.
   */
  useEffect(() => {
    if (isError) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAuth(false);
    }
  }, [isError]);

  /**
   * Manual re-check on `refreshUser()` calls (e.g. after profile edit).
   * Uses {@link checkTokenRef} to avoid re-firing when `checkToken`'s identity
   * changes — that path is already covered by the init effect above.
   */
  useEffect(() => {
    if (recheckTick === 0) {
      return;
    }
    checkTokenRef.current();
  }, [recheckTick]);

  const value = useMemo(
    () => ({
      isAuth,
      isLoading,
      ...(user !== undefined && { user }),
      authenticate: bumpReinit,
      refreshUser: bumpRecheck,
    }),
    [isAuth, isLoading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
