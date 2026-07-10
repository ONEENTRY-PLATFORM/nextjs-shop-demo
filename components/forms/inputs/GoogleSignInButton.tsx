'use client';

import type { JSX } from 'react';
import { useCallback, useState } from 'react';

import { getApi, isError } from '@/app/api';
import FormFieldAnimations from '@/components/forms/animations/FormFieldAnimations';

/**
 * OneEntry auth-provider marker for the Google Web OAuth provider.
 * ⚠️ Verified against the live API (type: "oauth", formIdentifier: "google_sign_in").
 * Do not guess — see `.claude/rules/mismatch-log.md`.
 */
const GOOGLE_PROVIDER_MARKER = 'google_web';

/**
 * "Sign in with Google" button.
 *
 * Kicks off the OAuth flow: reads the provider's base authorization URL from
 * OneEntry (`config.oauthAuthUrl` — never hardcoded), appends the standard
 * OAuth query params and full-page redirects to Google. Google returns to
 * `${NEXT_PUBLIC_APP_URL}/<lang>/auth/callback?code=...`, where the code is
 * exchanged for tokens (see `oauthLogInUser` + the callback page).
 * @param   {object}      props       - Component props.
 * @param   {string}      props.lang  - Current language shortcode (for the redirect URI).
 * @param   {string}      props.title - Button label.
 * @param   {number}      props.index - Stagger index for entrance animation.
 * @returns {JSX.Element}             Google sign-in button.
 * @see .claude/rules/auth-provider.md — "OAuth providers" section.
 */
const GoogleSignInButton = ({
  lang,
  title,
  index,
}: {
  lang: string;
  title: string;
  index: number;
}): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleGoogleLogin = useCallback(async (): Promise<void> => {
    setLoading(true);
    // Base URL lives in OneEntry provider config and differs per provider
    // (Google Web vs iOS, etc.) — must not be hardcoded.
    const provider = await getApi().AuthProvider.getAuthProviderByMarker(
      GOOGLE_PROVIDER_MARKER,
    );
    if (isError(provider) || !provider.config.oauthAuthUrl) {
      setLoading(false);
      return;
    }

    // Must match EXACTLY the URI registered in Google Cloud Console and the one
    // used by the server-side code exchange (oauthLogInUser). Lang-prefixed
    // because every route lives under `app/[lang]/`; `/google` namespaces the
    // provider (registered as …/auth/callback/google in Google Console).
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/${lang}/auth/callback/google`;

    window.location.href =
      `${provider.config.oauthAuthUrl}` +
      `?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent('openid email profile')}` +
      `&access_type=offline` +
      `&prompt=consent`;
  }, [lang]);

  return (
    <FormFieldAnimations index={index} className="">
      <button
        data-testid="google-login-button"
        type="button"
        disabled={loading}
        onClick={handleGoogleLogin}
        className="btn btn-lg mx-auto flex w-full max-w-70 items-center justify-center gap-3 rounded-full border border-gray-300 bg-white text-base font-bold text-neutral-700 transition-colors hover:bg-gray-50 disabled:opacity-60"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 48 48"
          aria-hidden="true"
          className="shrink-0"
        >
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
          />
          <path
            fill="#4285F4"
            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
          />
          <path
            fill="#FBBC05"
            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
          />
          <path
            fill="#34A853"
            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
          />
        </svg>
        {title}
      </button>
    </FormFieldAnimations>
  );
};

export default GoogleSignInButton;
