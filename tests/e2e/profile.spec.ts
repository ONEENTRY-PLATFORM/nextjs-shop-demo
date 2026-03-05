import { expect, test } from '@playwright/test';

import { clearAuthState, signIn } from './helpers/auth-helpers';
import { ROUTES, SELECTORS, TEST_AUTH_USER } from './settings';

/**
 * E2E tests for the user profile page
 */
test.describe('Profile Page', () => {
  test.describe('Unauthenticated Access', () => {
    test('profile page shows auth error when not logged in', async ({
      page,
    }) => {
      await page.goto(ROUTES.profile);
      await page.waitForLoadState('networkidle');

      // Should show auth error or redirect to home
      const url = page.url();
      const isOnProfile = url.includes('/profile');

      if (isOnProfile) {
        // If still on profile page, should show an auth error message
        const authError = page.locator(
          '[data-testid="auth-error"], .auth-error, [class*="auth"]',
        );
        const loginPrompt = page.getByText(
          /sign in|log in|please login|unauthorized/i,
        );
        const hasError =
          (await authError.isVisible().catch(() => false)) ||
          (await loginPrompt.isVisible().catch(() => false));
        expect(hasError).toBeTruthy();
      } else {
        // Redirected away from profile — acceptable behavior
        expect(url).not.toContain('/profile');
      }
    });
  });

  test.describe('Authenticated Access', () => {
    test.beforeEach(async ({ page }) => {
      await signIn(page, TEST_AUTH_USER.email, TEST_AUTH_USER.password);
    });

    test.afterEach(async ({ page }) => {
      await clearAuthState(page);
    });

    test('authenticated user can access profile page', async ({ page }) => {
      await page.goto(ROUTES.profile);
      await page.waitForLoadState('networkidle');

      // Should be on profile page
      expect(page.url()).toContain('/profile');

      // Should not show auth error
      const authError = page.getByText(/sign in|log in|please login/i);
      await expect(authError).not.toBeVisible();
    });

    test('profile page contains user form', async ({ page }) => {
      await page.goto(ROUTES.profile);
      await page.waitForLoadState('networkidle');

      // Profile page should have form elements
      const form = page.locator('form');
      const inputs = page.locator('input[type="text"], input[type="email"]');

      const hasForm = await form.isVisible().catch(() => false);
      const hasInputs = (await inputs.count()) > 0;

      expect(hasForm || hasInputs).toBeTruthy();
    });

    test('profile page has save/submit button', async ({ page }) => {
      await page.goto(ROUTES.profile);
      await page.waitForLoadState('networkidle');

      const submitButton = page.locator(
        'button[type="submit"], button:has-text("Save"), button:has-text("Update")',
      );
      const hasButton = await submitButton
        .first()
        .isVisible()
        .catch(() => false);
      expect(hasButton).toBeTruthy();
    });

    test('profile page displays navigation', async ({ page }) => {
      await page.goto(ROUTES.profile);
      await page.waitForLoadState('networkidle');

      // Header navigation should be visible
      const nav = page.locator('nav, header');
      await expect(nav.first()).toBeVisible();
    });

    test('user menu button changes to user menu after login', async ({
      page,
    }) => {
      await page.goto(ROUTES.home);
      await page.waitForLoadState('networkidle');

      const userMenuButton = page.locator(SELECTORS.userMenuButton).first();
      await expect(userMenuButton).toBeVisible({ timeout: 10000 });
    });
  });
});
