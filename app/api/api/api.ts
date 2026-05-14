import { defineOneEntry } from 'oneentry';
import type { IError } from 'oneentry/dist/base/utils';

const PROJECT_URL = process.env.NEXT_PUBLIC_PROJECT_URL as string;
const APP_TOKEN = process.env.NEXT_PUBLIC_APP_TOKEN as string;

/** Default SDK language used as a fallback when no langCode is provided. */
const DEFAULT_LANG = 'en_US';

/**
 * SDK callback that persists the rotated refresh token to localStorage.
 * Called automatically by the SDK on every refresh.
 * @param   {string}        refreshToken - Refresh token returned from the API.
 * @returns {Promise<void>}              Resolved once the token is saved.
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry CMS docs}
 */
const saveFunction = async (refreshToken: string): Promise<void> => {
  if (!refreshToken) {
    return;
  }
  localStorage.setItem('refresh-token', refreshToken);
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (apiInstance.AuthProvider as any).state as SdkState;

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
 * @param   {string}        langCode     - Current language code.
 * @returns {Promise<void>}              Resolved once the SDK state is updated.
 * @see {@link https://oneentry.cloud/instructions/npm OneEntry CMS docs}
 */
export async function reDefine(
  refreshToken: string,
  langCode: string,
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
