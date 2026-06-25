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

import {
  hasActiveSession,
  reDefine,
  RTKApi,
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
   * True once an authenticated session has been established. Gates the RTK
   * cache reset so it fires only on a real authed→unauthed transition (logout /
   * expiry) — NOT for a guest with no session, where a global `resetApiState`
   * would abort in-flight PUBLIC queries (e.g. product breadcrumbs) and trigger
   * a redundant double-fetch. Effects flush child-first, so the parent reset
   * would otherwise land on a child's just-started public query.
   */
  const hadSessionRef = useRef(false);

  /**
   * Clears all client-side auth state. Used whenever the session ends or a
   * token check fails (logout, expired session) so no stale `user` lingers in
   * the context after `isAuth` flips to false.
   * @returns {void} Nothing.
   */
  const resetAuth = useCallback((): void => {
    setIsAuth(false);
    setUser(undefined);
    // Drop cached authed data (getMe, orders, accounts, …) so a stale private
    // payload can't be read after the session ends — but only if we actually
    // had a session, otherwise we'd needlessly abort a guest's public queries.
    if (hadSessionRef.current) {
      hadSessionRef.current = false;
      dispatch(RTKApi.util.resetApiState());
    }
  }, [dispatch]);

  /**
   * Re-fetches the current user via RTK Query and updates auth state.
   * Memoized so it can be safely listed as an effect dep.
   * @returns {Promise<void>} Resolves once auth state is reconciled.
   */
  const checkToken = useCallback(async (): Promise<void> => {
    const refresh = localStorage.getItem('refresh-token');
    if (!refresh) {
      resetAuth();
      return;
    }
    try {
      const res = await trigger({ langCode });
      if ((res.isError && !res.isLoading) || !res.data?.id) {
        resetAuth();
      } else {
        setUser(res.data);
        setIsAuth(true);
        hadSessionRef.current = true;
      }
    } catch {
      resetAuth();
    }
  }, [langCode, trigger, resetAuth]);

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
   * Tracks the init trigger currently being processed (`reinitTick:langCode`).
   * Two jobs: (1) dedupe React StrictMode's dev double-invoke so one logical
   * init never fires two reDefine/refresh calls — correctness no longer depends
   * on the SDK's internal /refresh single-flight; (2) guard async setState so a
   * superseded run (rapid re-init) can't overwrite the newer run. Replaces the
   * previous per-run `cancelled` flag.
   */
  const initKeyRef = useRef<string | null>(null);

  /**
   * Full re-init: read the refresh token from localStorage, sync the SDK,
   * then verify the token. Re-runs on `reinitTick` (login/logout) or langCode.
   */
  useEffect(() => {
    const initKey = `${reinitTick}:${langCode}`;
    if (initKeyRef.current === initKey) {
      return; // StrictMode double-invoked the effect with identical deps.
    }
    initKeyRef.current = initKey;

    /**
     * Whether this run is still the latest init (not superseded by a newer one).
     * @returns {boolean} True while `initKeyRef` still matches this run's key.
     */
    const isCurrent = (): boolean => initKeyRef.current === initKey;

    const initAuth = async (): Promise<void> => {
      setIsLoading(true);

      const refresh = localStorage.getItem('refresh-token');
      if (!refresh) {
        if (isCurrent()) {
          resetAuth();
          setIsLoading(false);
        }
        return;
      }
      if (!hasActiveSession()) {
        await reDefine(refresh, langCode);
      }
      if (isCurrent()) {
        await checkToken();
        if (isCurrent()) setIsLoading(false);
      }
    };
    initAuth();
  }, [reinitTick, langCode, checkToken, resetAuth]);

  /**
   * Drop auth on RTK Query polling errors (e.g. expired session).
   * setState-in-effect is intentional: this reacts to a derived change in the
   * polling result, not to a user-driven event.
   */
  useEffect(() => {
    if (isError) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      resetAuth();
    }
  }, [isError, resetAuth]);

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
