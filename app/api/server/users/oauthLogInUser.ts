'use server';

import { defineOneEntry } from 'oneentry';
import type { IAuthEntity } from 'oneentry/types';

import { isError } from '@/app/api';
import { getApiErrorMessage } from '@/app/utils/getApiErrorMessage';

const PROJECT_URL = process.env.NEXT_PUBLIC_PROJECT_URL as string;
const APP_TOKEN = process.env.NEXT_PUBLIC_APP_TOKEN as string;

/**
 * OneEntry auth-provider marker for the Google Web OAuth provider.
 * Must match the marker used by GoogleSignInButton for the redirect.
 */
const GOOGLE_PROVIDER_MARKER = 'google_web';

type OauthLogInProps = {
  /** Authorization `code` returned by Google on the callback URL. */
  code: string;
  /** Exact redirect URI used in the initial redirect (Google validates the match). */
  redirectUri: string;
  /**
   * Browser device-metadata string ({@link getApi().AuthProvider.getDeviceMetadata})
   * captured on the callback page. The API binds the refresh token to this
   * fingerprint, so it MUST be the browser's — otherwise the token is bound to
   * the server (Node.js) fingerprint and can never be refreshed from the browser.
   */
  deviceMetadata: string;
};

/**
 * Exchanges a Google OAuth `code` for OneEntry tokens (server-side).
 *
 * Runs as a Server Action because `client_secret` must never reach the client.
 * Uses a short-lived per-request SDK instance stamped with the browser's
 * `deviceMetadata` (SDK ≥ 1.0.155) instead of mutating the shared `getApi()`
 * singleton — the singleton's state is shared across all visitors, so a
 * `setDeviceMetadata()` on it would race concurrent OAuth callbacks.
 * @param   {OauthLogInProps}                                     props                - OAuth exchange input.
 * @param   {string}                                              props.code           - Google authorization code.
 * @param   {string}                                              props.redirectUri    - Redirect URI used at redirect time.
 * @param   {string}                                              props.deviceMetadata - Browser fingerprint string.
 * @returns {Promise<{ token: IAuthEntity } | { error: string }>}                      Tokens or an error.
 * @see .claude/rules/auth-provider.md — "OAuth providers" section.
 * @see /create-google-oauth skill (OneEntry MCP).
 */
export const oauthLogInUser = async ({
  code,
  redirectUri,
  deviceMetadata,
}: OauthLogInProps): Promise<{ token: IAuthEntity } | { error: string }> => {
  // An empty string silently falls back to the server fingerprint — the issued
  // refresh token would not be refreshable from the browser.
  if (!deviceMetadata) {
    return { error: 'deviceMetadata was not passed from the callback page.' };
  }

  const api = defineOneEntry(PROJECT_URL, {
    token: APP_TOKEN,
    deviceMetadata, // ← refresh token gets bound to the browser fingerprint
  });

  const result = await api.AuthProvider.oauth(GOOGLE_PROVIDER_MARKER, {
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
    client_secret: process.env.GOOGLE_CLIENT_SECRET as string, // server-only secret
    code,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri,
  });

  if (isError(result)) {
    return { error: getApiErrorMessage(result) };
  }

  return { token: result as IAuthEntity };
};
