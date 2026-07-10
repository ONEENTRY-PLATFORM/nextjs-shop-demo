'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import type { JSX } from 'react';
import { Suspense, useContext, useEffect, useRef, useState } from 'react';

import { getApi, oauthLogInUser, syncTokens } from '@/app/api';
import { AuthContext } from '@/app/store/providers/AuthContext';

/**
 * OneEntry auth-provider marker for the Google Web OAuth provider.
 * Stored in localStorage so the SDK targets `/marker/google_web/refresh`
 * on proactive token refresh.
 */
const GOOGLE_PROVIDER_MARKER = 'google_web';

/**
 * Handles the Google OAuth redirect: reads `?code=...`, exchanges it for
 * OneEntry tokens via {@link oauthLogInUser} (server-side), then establishes
 * the client session and returns home.
 * @returns {JSX.Element} Loading / error UI while the exchange runs.
 */
const GoogleCallback = (): JSX.Element => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();
  const lang = (params.lang as string) || 'en';
  const { authenticate } = useContext(AuthContext);
  const [error, setError] = useState<string | null>(null);
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) {
      return; // StrictMode / re-render guard — exchange the code exactly once.
    }
    processed.current = true;

    const home = `/${lang}`;
    const code = searchParams.get('code');
    const errorParam = searchParams.get('error');

    if (errorParam || !code) {
      // Reacting to the redirect URL (an external system), not to React state.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError(
        errorParam
          ? 'Google sign-in was cancelled.'
          : 'Authorization code was not received.',
      );
      setTimeout(() => router.push(home), 2500);
      return;
    }

    void (async () => {
      // Browser fingerprint the API binds the refresh token to (SDK ≥ 1.0.155).
      // getDeviceMetadata() is a per-module method — not on the root getApi() object.
      const deviceMetadata = getApi().AuthProvider.getDeviceMetadata();
      // Must byte-for-byte match the redirect URI the button used AND the one
      // registered in Google Cloud Console (…/auth/callback/google).
      const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/${lang}/auth/callback/google`;

      const result = await oauthLogInUser({
        code,
        redirectUri,
        deviceMetadata,
      });
      if ('error' in result) {
        setError(result.error);
        setTimeout(() => router.push(home), 3500);
        return;
      }

      const { token } = result;
      localStorage.setItem('refresh-token', token.refreshToken);
      localStorage.setItem('authProviderMarker', GOOGLE_PROVIDER_MARKER);
      // Reuse the tokens from the exchange directly (no extra /refresh round-trip).
      syncTokens(token.accessToken, token.refreshToken);
      // Re-run AuthContext init: it sees the active session and fetches the user.
      authenticate();
      router.push(home);
    })();
  }, [searchParams, router, lang, authenticate]);

  return (
    <div
      data-testid="oauth-callback"
      className="flex min-h-[50vh] items-center justify-center px-4 text-center"
    >
      {error ? (
        <p data-testid="oauth-error" className="text-lg text-red-500">
          {error}
        </p>
      ) : (
        <p data-testid="oauth-loading" className="text-lg text-neutral-600">
          Signing you in…
        </p>
      )}
    </div>
  );
};

/**
 * Route wrapper. `useSearchParams` requires a Suspense boundary in the App
 * Router, so the interactive part is isolated in {@link GoogleCallback}.
 * @returns {JSX.Element} The Google OAuth callback page.
 */
const AuthCallbackPage = (): JSX.Element => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-lg text-neutral-600">
          Signing you in…
        </div>
      }
    >
      <GoogleCallback />
    </Suspense>
  );
};

export default AuthCallbackPage;
