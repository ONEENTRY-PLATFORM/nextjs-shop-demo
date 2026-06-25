import { defineOneEntry } from 'oneentry';
import type { IError } from 'oneentry/dist/base/utils';

const PROJECT_URL = process.env.NEXT_PUBLIC_PROJECT_URL as string;
const APP_TOKEN = process.env.NEXT_PUBLIC_APP_TOKEN as string;

/** Default SDK language used as a fallback when no langCode is provided. */
const DEFAULT_LANG = 'en_US';

/**
 * Fails fast with an actionable message when the SDK credentials are missing.
 *
 * Without this guard a missing `NEXT_PUBLIC_PROJECT_URL` reaches the SDK as
 * `undefined` and crashes the whole app at import time with the cryptic
 * `Cannot read properties of undefined (reading 'endsWith')` (the SDK calls
 * `url.endsWith('/')` internally). Reading `.env*` happens only at process
 * start, so the usual cause is a dev server launched before the variables
 * existed — restart it after fixing `.env.local`.
 * @throws {Error} When `NEXT_PUBLIC_PROJECT_URL` or `NEXT_PUBLIC_APP_TOKEN` is unset.
 */
const missingEnv = [
  !PROJECT_URL && 'NEXT_PUBLIC_PROJECT_URL',
  !APP_TOKEN && 'NEXT_PUBLIC_APP_TOKEN',
].filter(Boolean);

if (missingEnv.length > 0) {
  throw new Error(
    `OneEntry SDK: missing required env ${missingEnv.join(', ')}. ` +
      'Set them in .env.local and restart the dev server ' +
      '(env files are read only at process start).',
  );
}

/**
 * SDK callback that syncs the refresh token with localStorage.
 *
 * The SDK calls this on every token rotation with the new token, AND on
 * `logout()` / `logoutAll()` with an **empty string** — the empty value is the
 * SDK's signal to drop the stored session. Treating `''` as a no-op (instead of
 * a remove) leaves a dead token in localStorage, which the next re-init re-uses
 * and burns on a doomed proactive `/refresh` (400 → 401).
 *
 * Guarded by a `window` check: the SDK may rotate the token during an
 * SSR/Server Action request, where `localStorage` does not exist.
 * @param   {string}        refreshToken - New refresh token, or `''` to clear.
 * @returns {Promise<void>}              Resolved once localStorage is updated.
 * @see {@link https://js-sdk.oneentry.cloud/docs/index/ OneEntry CMS docs}
 */
const saveFunction = async (refreshToken: string): Promise<void> => {
  if (typeof window === 'undefined') {
    return;
  }
  if (refreshToken) {
    localStorage.setItem('refresh-token', refreshToken);
  } else {
    localStorage.removeItem('refresh-token');
  }
};

/**
 * Singleton SDK instance. All sub-modules (AuthProvider, Users, Products, …)
 * share the same internal `state` object — mutating it here is visible everywhere.
 *
 * IMPORTANT: never reassign — `reDefine()` mutates this instance in place to
 * preserve the per-instance device fingerprint within the user session.
 */
const apiInstance = defineOneEntry(PROJECT_URL, {
  token: APP_TOKEN,
  langCode: DEFAULT_LANG,
  auth: {
    saveFunction,
  },
});

/** Minimal shape of the shared SDK state we need to read/write. */
type SdkState = {
  accessToken?: string;
  refreshToken?: string;
  lang?: string;
};

/**
 * Returns the shared SDK state object (protected in the SDK type definitions).
 * Cross-module access is safe — every API module references the same instance.
 * @returns {SdkState} Mutable shared state.
 */
const getState = (): SdkState =>
  // The SDK marks `state` as protected; AuthProvider holds the shared instance.
  (apiInstance.AuthProvider as unknown as { state: SdkState }).state;

/**
 * API getter that returns the singleton SDK instance.
 * @returns {ReturnType<typeof defineOneEntry>} Current api instance.
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry CMS docs}
 */
export const getApi = (): ReturnType<typeof defineOneEntry> => apiInstance;

/**
 * True when the SDK currently holds a valid in-memory access token.
 *
 * Use this **before** calling {@link reDefine} to avoid burning a freshly
 * issued refreshToken right after login.
 * @returns {boolean} Whether the SDK has an active authenticated session.
 */
export const hasActiveSession = (): boolean => Boolean(getState().accessToken);

/**
 * Sets both tokens directly on the singleton instance.
 *
 * Preferred over {@link reDefine} in the `login()` flow: it reuses the
 * `accessToken` already returned by `auth()`/`oauth()` instead of clearing it
 * and forcing the SDK into an extra `/refresh` round-trip on the first request.
 * Mutates the current instance, so the device fingerprint is preserved.
 * @param   {string} accessToken  - Access token from the auth response.
 * @param   {string} refreshToken - Refresh token from the auth response.
 * @returns {void}                Nothing.
 */
export const syncTokens = (accessToken: string, refreshToken: string): void => {
  apiInstance.AuthProvider.setAccessToken(accessToken);
  apiInstance.AuthProvider.setRefreshToken(refreshToken);
};

/**
 * Returns the SDK's current language code.
 * Convenient in Client Components where `useParams` is not available.
 * @returns {string} Current langCode (defaults to {@link DEFAULT_LANG}).
 */
export const getLang = (): string => getState().lang || DEFAULT_LANG;

/**
 * Type guard: narrows an SDK response to {@link IError} when the call failed.
 *
 * Co-located with `getApi`/`reDefine` so all SDK helpers live in one file
 * (per MCP convention `lib/oneentry.ts`).
 * @param   {unknown} result - Value returned by any SDK method.
 * @returns {boolean}        True when `result` is an {@link IError}.
 */
export const isError = (result: unknown): result is IError =>
  typeof result === 'object' &&
  result !== null &&
  'statusCode' in result &&
  'message' in result;

/**
 * Updates the SDK with a new refresh token and language code by **mutating**
 * the singleton — preserves the device fingerprint within the session.
 *
 * Recreating the instance via `defineOneEntry()` here would generate a new
 * `instanceId`, which would change the fingerprint sent in `x-device-metadata`
 * and force the API to reject the existing refresh token. See `MEMORY.md`
 * (bug #4 / #5) for context.
 * @param   {string}        refreshToken - Refresh token from localStorage.
 * @param   {string}        [langCode]   - Current language code (defaults to {@link DEFAULT_LANG}).
 * @returns {Promise<void>}              Resolved once the SDK state is updated.
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry CMS docs}
 */
export async function reDefine(
  refreshToken: string,
  langCode?: string,
): Promise<void> {
  if (!refreshToken) {
    return;
  }

  const state = getState();
  state.lang = langCode || DEFAULT_LANG;
  apiInstance.AuthProvider.setRefreshToken(refreshToken);
  // Force the SDK to fetch a fresh access token on the next request.
  apiInstance.AuthProvider.setAccessToken('');
}
