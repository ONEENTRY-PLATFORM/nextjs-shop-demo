import { expect, test } from '@playwright/test';

import { openSignInModal } from './helpers/auth-helpers';
import { waitForPageLoad } from './helpers/navigation-helpers';
import { ROUTES, SELECTORS } from './settings';

/**
 * E2E tests for the Google OAuth sign-in flow.
 *
 * Scope (no real Google account required):
 * 1. the "Sign in with Google" button is present in the sign-in modal;
 * 2. clicking it hands off to accounts.google.com with the correct OAuth
 * query params (built from the OneEntry provider's `oauthAuthUrl` + env);
 * 3. the callback page surfaces an error when it is reached without a `code`
 * or with `?error=...`.
 *
 * The full round-trip (real Google login → code → token) is intentionally NOT
 * automated: Google detects headless automation and blocks it, making such a
 * test inherently flaky. See the commented `Real OAuth` block at the bottom.
 *
 * NB: the redirect test only needs the redirect to *leave* for Google — with a
 * placeholder `NEXT_PUBLIC_GOOGLE_CLIENT_ID` Google will render an
 * "invalid client" page, but the outgoing request still carries our params,
 * which is exactly what we assert on (captured via `waitForRequest`).
 */
test.describe('Google OAuth — sign-in button & redirect', () => {
  test.setTimeout(40_000);

  test('Google login button is visible in the sign-in modal', async ({
    page,
  }) => {
    await openSignInModal(page);

    await expect(page.locator(SELECTORS.googleLoginButton)).toBeVisible();
  });

  test('click hands off to accounts.google.com with correct OAuth params', async ({
    page,
  }) => {
    await openSignInModal(page);

    // Capture the outgoing navigation to Google — its URL carries the params our
    // app built. Reading page.url() *after* landing is unreliable (Google may
    // rewrite the URL to an error page and drop the query string).
    const requestPromise = page.waitForRequest(
      (req) => req.url().includes('accounts.google.com'),
      { timeout: 15_000 },
    );

    await page.locator(SELECTORS.googleLoginButton).click();

    const request = await requestPromise;
    const url = new URL(request.url());

    expect(url.hostname).toContain('accounts.google.com');
    expect(url.searchParams.get('client_id')).toBeTruthy();
    expect(url.searchParams.get('response_type')).toBe('code');
    expect(url.searchParams.get('redirect_uri')).toContain(
      '/auth/callback/google',
    );
    expect(url.searchParams.get('scope')).toContain('email');
  });
});

test.describe('Google OAuth — callback error handling', () => {
  test.setTimeout(30_000);

  test('callback without a code shows an error', async ({ page }) => {
    await page.goto(ROUTES.authCallback);

    await expect(page.locator(SELECTORS.oauthError)).toBeVisible({
      timeout: 8_000,
    });
  });

  test('callback with ?error=access_denied shows an error', async ({
    page,
  }) => {
    await page.goto(`${ROUTES.authCallback}?error=access_denied`);

    const oauthError = page.locator(SELECTORS.oauthError);
    await expect(oauthError).toBeVisible({ timeout: 8_000 });
    await expect(oauthError).toContainText(/cancel|denied|error/i);
  });

  test('callback without a code redirects home shortly after', async ({
    page,
  }) => {
    await page.goto(ROUTES.authCallback);

    // The page shows the error, then auto-redirects to `/<lang>` (~2.5s).
    await page.waitForURL(/\/en\/?$/, { timeout: 8_000 });
    await waitForPageLoad(page);
    await expect(page).toHaveURL(/\/en\/?$/);
  });
});

// ⚠️ Real OAuth round-trip — Google detects headless automation and blocks
// automated logins, so this is unstable and left disabled by default.
// Enable only with a dedicated test Google account:
//   E2E_GOOGLE_TEST_EMAIL / E2E_GOOGLE_TEST_PASSWORD in tests/.env
//
// test.describe('Google OAuth — real flow (experimental)', () => {
//   const GOOGLE_EMAIL = process.env.E2E_GOOGLE_TEST_EMAIL || '';
//   const GOOGLE_PASSWORD = process.env.E2E_GOOGLE_TEST_PASSWORD || '';
//   test.skip(
//     !GOOGLE_EMAIL || !GOOGLE_PASSWORD,
//     'E2E_GOOGLE_TEST_EMAIL/PASSWORD not set',
//   );
//   test('login via Google returns to the site with a refresh-token', async ({
//     page,
//   }) => {
//     await openSignInModal(page);
//     await page.locator(SELECTORS.googleLoginButton).click();
//     await page.waitForURL(/accounts\.google\.com/);
//     await page.getByRole('textbox', { name: /email/i }).fill(GOOGLE_EMAIL);
//     await page.getByRole('button', { name: /next|далее/i }).click();
//     await page.getByRole('textbox', { name: /password/i }).fill(GOOGLE_PASSWORD);
//     await page.getByRole('button', { name: /next|далее/i }).click();
//     await page.waitForURL(/\/en\/?$/, { timeout: 30_000 });
//     const token = await page.evaluate(() =>
//       localStorage.getItem('refresh-token'),
//     );
//     expect(token).toBeTruthy();
//   });
// });
