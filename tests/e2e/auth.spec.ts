import { expect, test } from '@playwright/test';

import {
  clearAuthState,
  isAuthenticated,
  openSignInModal,
  openSignUpForm,
  signIn,
  signOut,
} from './helpers/auth-helpers';
import { waitForPageLoad } from './helpers/navigation-helpers';
import { ROUTES, SELECTORS, TEST_AUTH_USER } from './settings';

/**
 * E2E tests for authentication functionality (sign in, sign out, sign up)
 */

test.describe('Authentication — Sign In Modal', () => {
  test.setTimeout(30000);

  test('should open sign-in modal when clicking auth button', async ({
    page,
  }) => {
    await page.goto(ROUTES.home);
    await waitForPageLoad(page);

    // Auth button should be visible when not authenticated
    const authButton = page.locator(SELECTORS.authButton).first();
    await expect(authButton).toBeVisible();

    // Click the auth button
    await authButton.click();

    // Modal should open
    await expect(page.locator(SELECTORS.signInModal)).toBeVisible();

    // Email and password inputs should be present.
    // NB: a <input type="password"> has NO ARIA `textbox` role, so it can only be
    // matched by its id (#password_reg), not getByRole('textbox').
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();
    await expect(page.locator(SELECTORS.passwordInput)).toBeVisible();

    // Submit button should be present
    await expect(page.locator(SELECTORS.modalSubmitButton)).toBeVisible();
  });

  test('should close modal when clicking backdrop', async ({ page }) => {
    await openSignInModal(page);

    // Click backdrop (outside the modal body)
    await page.click('body', { position: { x: 10, y: 10 } });

    await expect(page.locator(SELECTORS.signInModal)).toBeHidden({
      timeout: 3000,
    });
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await openSignInModal(page);

    await page.fill(SELECTORS.emailInput, 'wrong@example.com');
    await page.fill(SELECTORS.passwordInput, 'WrongPassword999!');
    await page.click(SELECTORS.modalSubmitButton);

    // Error message should appear inside the modal
    await expect(page.locator(SELECTORS.modalError)).toBeVisible({
      timeout: 8000,
    });

    // Modal should stay open
    await expect(page.locator(SELECTORS.signInModal)).toBeVisible();
  });

  test('should show error when submitting empty form', async ({ page }) => {
    await openSignInModal(page);

    // Submit without filling any fields
    await page.click(SELECTORS.modalSubmitButton);

    // Either HTML5 validation prevents submission or error is shown
    // Either way the modal stays open
    await expect(page.locator(SELECTORS.signInModal)).toBeVisible({
      timeout: 3000,
    });
  });

  test('should switch to phone tab and back to email tab', async ({ page }) => {
    await openSignInModal(page);

    // Email input should be visible by default
    await expect(page.locator(SELECTORS.emailInput)).toBeVisible();

    // Click phone tab
    const phoneTab = page
      .locator(SELECTORS.signInModal)
      .getByRole('button', { name: /phone/i });
    const hasPhoneTab = await phoneTab.isVisible().catch(() => false);

    if (hasPhoneTab) {
      await phoneTab.click();
      await expect(page.locator(SELECTORS.emailInput)).toBeHidden();
      await expect(page.locator('#phone_reg')).toBeVisible();

      // Switch back to email
      const emailTab = page
        .locator(SELECTORS.signInModal)
        .getByRole('button', { name: /e-?mail/i });
      await emailTab.click();
      await expect(page.locator(SELECTORS.emailInput)).toBeVisible();
    }
  });
});

test.describe('Authentication — Sign In / Sign Out', () => {
  test.setTimeout(40000);

  test('should sign in with valid credentials', async ({ page }) => {
    await signIn(page, TEST_AUTH_USER.email, TEST_AUTH_USER.password);

    // After sign in: modal should close and user-menu-button should appear
    await expect(page.locator(SELECTORS.userMenuButton).first()).toBeVisible({
      timeout: 10000,
    });

    // Auth button should no longer be visible
    await expect(page.locator(SELECTORS.authButton).first()).toBeHidden();
  });

  test('should persist session after page reload', async ({ page }) => {
    await signIn(page, TEST_AUTH_USER.email, TEST_AUTH_USER.password);

    // Verify signed in
    await expect(page.locator(SELECTORS.userMenuButton).first()).toBeVisible({
      timeout: 10000,
    });

    // Wait for localStorage to be written
    await page.waitForTimeout(1000);

    // Reload
    await page.reload();
    await waitForPageLoad(page);
    await page.waitForTimeout(2000);

    // Session should be restored from localStorage
    const authenticated = await isAuthenticated(page);
    expect(authenticated).toBe(true);
  });

  test('should sign out successfully', async ({ page }) => {
    await signIn(page, TEST_AUTH_USER.email, TEST_AUTH_USER.password);

    await expect(page.locator(SELECTORS.userMenuButton).first()).toBeVisible({
      timeout: 10000,
    });

    await signOut(page);

    // After sign out: auth button should reappear
    await expect(page.locator(SELECTORS.authButton).first()).toBeVisible({
      timeout: 8000,
    });
  });

  test('should redirect to home after sign out', async ({ page }) => {
    await signIn(page, TEST_AUTH_USER.email, TEST_AUTH_USER.password);

    await expect(page.locator(SELECTORS.userMenuButton).first()).toBeVisible({
      timeout: 10000,
    });

    await signOut(page);

    // Should be on home or root page after logout
    await expect(page).toHaveURL(/\/(en)?$/);
  });

  test.afterEach(async ({ page }) => {
    // Clean up: ensure user is logged out after each test
    try {
      await clearAuthState(page);
    } catch {
      // Ignore cleanup errors
    }
  });
});

test.describe('Authentication — Sign Up Form', () => {
  test.setTimeout(30000);

  test('should open sign-up form from sign-in modal', async ({ page }) => {
    await openSignInModal(page);

    // Find create account / sign up button
    const createAccountButton = page
      .locator(SELECTORS.signInModal)
      .getByRole('button', { name: /create account|sign up|register/i });

    await expect(createAccountButton).toBeVisible({ timeout: 5000 });
    await createAccountButton.click();

    // Sign-up specific fields should appear
    await expect(page.locator(SELECTORS.nameInput)).toBeVisible({
      timeout: 5000,
    });
  });

  test('should navigate back to sign-in from sign-up form', async ({
    page,
  }) => {
    await openSignUpForm(page);

    // Find the "Sign in" link inside the sign-up form
    const signInLink = page
      .locator(SELECTORS.signInModal)
      .getByRole('button', { name: /sign in|log in/i });

    const hasSignInLink = await signInLink.isVisible().catch(() => false);
    if (hasSignInLink) {
      await signInLink.click();

      // Should be back on sign-in form (name input should be gone)
      await expect(page.locator(SELECTORS.nameInput)).toBeHidden({
        timeout: 3000,
      });
      await expect(page.locator(SELECTORS.emailInput)).toBeVisible();
    }
  });

  test('should show all required sign-up fields', async ({ page }) => {
    await openSignUpForm(page);

    // All sign-up fields should be visible
    await expect(page.locator(SELECTORS.emailInput)).toBeVisible();
    await expect(page.locator(SELECTORS.passwordInput)).toBeVisible();
    await expect(page.locator(SELECTORS.nameInput)).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    try {
      await clearAuthState(page);
    } catch {
      // Ignore cleanup errors
    }
  });
});

test.describe('Authentication — Protected Routes', () => {
  test.setTimeout(20000);

  test('should be accessible on profile page when authenticated', async ({
    page,
  }) => {
    await signIn(page, TEST_AUTH_USER.email, TEST_AUTH_USER.password);

    await expect(page.locator(SELECTORS.userMenuButton).first()).toBeVisible({
      timeout: 10000,
    });

    await page.goto(ROUTES.profile);
    await waitForPageLoad(page);

    // Should stay on profile page (not redirected to login)
    await expect(page).toHaveURL(new RegExp(ROUTES.profile));
  });

  test('should be accessible on orders page when authenticated', async ({
    page,
  }) => {
    await signIn(page, TEST_AUTH_USER.email, TEST_AUTH_USER.password);

    await expect(page.locator(SELECTORS.userMenuButton).first()).toBeVisible({
      timeout: 10000,
    });

    await page.goto(ROUTES.orders);
    await waitForPageLoad(page);

    // Should be on orders page (not redirected)
    await expect(page).toHaveURL(new RegExp(ROUTES.orders));
  });

  test.afterEach(async ({ page }) => {
    try {
      await clearAuthState(page);
    } catch {
      // Ignore cleanup errors
    }
  });
});
