import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { ROUTES, SELECTORS } from '../settings';

/**
 * Helper functions for authentication in E2E tests
 */

/**
 * Opens the sign-in modal by clicking the auth button in the navbar.
 * Waits for both the modal container and the email input to be visible
 * (GSAP animates fields from width:0, so we must wait for the animation).
 * @param   {Page}          page - Playwright page object
 * @returns {Promise<void>}      Promise that resolves when the modal and its fields are ready
 */
export async function openSignInModal(page: Page): Promise<void> {
  await page.goto(ROUTES.home);
  await page.waitForLoadState('networkidle');

  const authButton = page.locator(SELECTORS.authButton).first();
  await expect(authButton).toBeVisible({ timeout: 10000 });
  await authButton.click();

  // Wait for modal container
  await expect(page.locator(SELECTORS.signInModal)).toBeVisible({
    timeout: 5000,
  });

  // Wait for GSAP field animations to complete (fields animate from width:0 with delay)
  await expect(page.locator(SELECTORS.emailInput)).toBeVisible({
    timeout: 8000,
  });
}

/**
 * Signs in a user with email and password
 * @param   {Page}          page     - Playwright page object
 * @param   {string}        email    - User email
 * @param   {string}        password - User password
 * @returns {Promise<void>}          Promise that resolves when sign-in is complete
 */
export async function signIn(
  page: Page,
  email: string,
  password: string,
): Promise<void> {
  await openSignInModal(page);

  await page.fill(SELECTORS.emailInput, email);
  await page.fill(SELECTORS.passwordInput, password);
  await page.click(SELECTORS.modalSubmitButton);

  // Wait for either success (modal closes) or error message
  await page
    .waitForSelector(SELECTORS.signInModal, { state: 'hidden', timeout: 10000 })
    .catch(() => {
      // Modal may stay open if there's an error — that's checked in the test
    });
}

/**
 * Signs out the currently authenticated user
 * @param   {Page}          page - Playwright page object
 * @returns {Promise<void>}      Promise that resolves when sign-out is complete
 */
export async function signOut(page: Page): Promise<void> {
  const userMenuButton = page.locator(SELECTORS.userMenuButton).first();
  await expect(userMenuButton).toBeVisible({ timeout: 5000 });
  await userMenuButton.click();

  const logoutButton = page.locator(SELECTORS.logoutButton).first();
  await expect(logoutButton).toBeVisible({ timeout: 3000 });
  await logoutButton.click();

  await page.waitForLoadState('networkidle');
}

/**
 * Checks whether the user is currently authenticated
 * @param   {Page}             page - Playwright page object
 * @returns {Promise<boolean>}      True if user is authenticated
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  const userMenuButton = page.locator(SELECTORS.userMenuButton).first();
  return userMenuButton.isVisible().catch(() => false);
}

/**
 * Opens the sign-up form from the sign-in modal
 * @param   {Page}          page - Playwright page object
 * @returns {Promise<void>}      Promise that resolves when the sign-up form is visible
 */
export async function openSignUpForm(page: Page): Promise<void> {
  await openSignInModal(page);

  // Click the "Create account" button which is inside the sign-in form
  const createAccountButton = page
    .locator(SELECTORS.signInModal)
    .getByRole('button', { name: /create account|sign up|register/i });
  await expect(createAccountButton).toBeVisible({ timeout: 5000 });
  await createAccountButton.click();

  // Wait for sign-up form fields (name field only appears in sign-up)
  await expect(page.locator(SELECTORS.nameInput)).toBeVisible({
    timeout: 5000,
  });
}

/**
 * Clears auth state by removing tokens from localStorage
 * Useful for cleanup after tests
 * @param   {Page}          page - Playwright page object
 * @returns {Promise<void>}      Promise that resolves when localStorage is cleared
 */
export async function clearAuthState(page: Page): Promise<void> {
  await page.evaluate(() => {
    localStorage.removeItem('refresh-token');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('authProviderMarker');
  });
  await page.reload();
  await page.waitForLoadState('networkidle');
}
