'use client';

import type { IError, IUserEntity } from 'oneentry/types';
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

import { clearTokens, hasActiveSession, reDefine } from '@/app/api/api/api';
import { RTKApi, useLazyGetMeQuery } from '@/app/api/api/RTKApi';
import { updateUserState } from '@/app/api/server/users/updateUserState';

import { useAppDispatch, useAppSelector } from '../hooks';
import {
  mergeCart,
  selectCartMeta,
  selectCartVersion,
  setCartVersion,
} from '../reducers/CartSlice';
import {
  mergeFavorites,
  selectFavoritesMeta,
  selectFavoritesVersion,
  setFavoritesVersion,
} from '../reducers/FavoritesSlice';
import {
  mergeLedger,
  normalizeCartLedger,
  normalizeFavLedger,
} from '../utils/ledger';

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
  const favoritesMeta = useAppSelector(selectFavoritesMeta);
  const cartMeta = useAppSelector(selectCartMeta);

  const [trigger, { isError, error: meError }] = useLazyGetMeQuery({
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
   * Logs out (and clears the dead refresh token) only on a **confirmed**
   * 401/403 — a transient network/5xx failure keeps the current session so a
   * flaky poll does not log the user out (tokens rule).
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
      if (res.data?.id) {
        setUser(res.data);
        setIsAuth(true);
        hadSessionRef.current = true;
        return;
      }
      /** Confirmed auth failure — the refresh token is dead, clear it */
      const statusCode = (res.error as IError | undefined)?.statusCode;
      if (statusCode === 401 || statusCode === 403) {
        clearTokens();
        resetAuth();
        return;
      }
      /** Transient failure (network/5xx) — keep the session, retry on next poll */
      if (res.isError) {
        return;
      }
      /** No user and no error envelope — treat as an ended session */
      resetAuth();
    } catch {
      /** Unexpected throw — not a confirmed auth error, keep the session */
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

  /**
   * Hydrate favorites + cart from the server on first auth by **merging** the
   * server and local (guest) tombstone ledgers (see {@link mergeLedger}). This
   * keeps the union across devices while letting newer deletions win — removed
   * items no longer resurrect on login. Runs once per session: the version
   * flags reset to 0 on every reload, so we always re-merge with the server.
   */
  useEffect(() => {
    if (!isAuth || !user) {
      return;
    }
    const serverState = user.state as Record<string, unknown>;
    if (favoritesVersion === 0) {
      dispatch(
        mergeFavorites(
          mergeLedger(favoritesMeta, normalizeFavLedger(serverState)),
        ),
      );
      dispatch(setFavoritesVersion(1));
    }
    if (cartVersion === 0) {
      dispatch(
        mergeCart(mergeLedger(cartMeta, normalizeCartLedger(serverState))),
      );
      dispatch(setCartVersion(1));
    }
  }, [
    isAuth,
    user,
    favoritesVersion,
    cartVersion,
    favoritesMeta,
    cartMeta,
    dispatch,
  ]);

  /**
   * Push the merged favorites/cart ledgers to the server whenever they change.
   * Gated until after hydration (version > 0) so a pre-merge empty state never
   * overwrites the server. {@link updateUserState} re-merges with the freshest
   * server snapshot before writing, so concurrent changes are not clobbered.
   */
  useEffect(() => {
    if (!isAuth || !user) {
      return;
    }
    if (favoritesVersion === 0 || cartVersion === 0) {
      return;
    }
    updateUserState({ favoritesMeta, cartMeta });
  }, [isAuth, user, favoritesVersion, cartVersion, favoritesMeta, cartMeta]);

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
   * Drop auth on RTK Query polling errors — but only on a **confirmed**
   * 401/403 (expired/dead session). Transient network/5xx poll failures keep
   * the session (tokens rule: "log out only on confirmed 401/403").
   * setState-in-effect is intentional: this reacts to a derived change in the
   * polling result, not to a user-driven event.
   */
  useEffect(() => {
    const statusCode = (meError as IError | undefined)?.statusCode;
    if (isError && (statusCode === 401 || statusCode === 403)) {
      clearTokens();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      resetAuth();
    }
  }, [isError, meError, resetAuth]);

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
