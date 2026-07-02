import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { ROUTES, SELECTORS } from '../settings';
import { waitForPageLoad } from './navigation-helpers';

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
  await waitForPageLoad(page);

  const authButton = page.locator(SELECTORS.authButton).first();
  await expect(authButton).toBeVisible({ timeout: 10000 });

  // The header is a client component; a click dispatched before hydration is a
  // no-op and the modal never opens. Retry the click until the modal appears.
  // toPass stops as soon as the inner assertion passes, so a hydrated first click
  // opens the modal without a second (toggling) click.
  const modal = page.locator(SELECTORS.signInModal);
  await expect(async () => {
    await authButton.click();
    await expect(modal).toBeVisible({ timeout: 3000 });
  }).toPass({ timeout: 20000 });

  // Wait for GSAP field animations to complete (fields animate from width:0 with delay)
  // The raw <input> is CSS-hidden (floating label pattern) — wait for the visible textbox role instead
  await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible({
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

  // Modal must close — if it stays open, sign-in failed (wrong credentials or API error)
  await page.waitForSelector(SELECTORS.signInModal, {
    state: 'hidden',
    timeout: 10000,
  });

  // Wait for auth token to land in localStorage and network to settle
  // so AuthContext has time to complete getUser and flip isAuth=true
  await page.waitForFunction(() => !!localStorage.getItem('refresh-token'), {
    timeout: 5000,
  });
  await waitForPageLoad(page);
}

/**
 * Signs out the currently authenticated user
 * @param   {Page}          page - Playwright page object
 * @returns {Promise<void>}      Promise that resolves when sign-out is complete
 */
export async function signOut(page: Page): Promise<void> {
  const userMenuButton = page.locator(SELECTORS.userMenuButton).first();
  await expect(userMenuButton).toBeVisible({ timeout: 5000 });

  // Open the dropdown by HOVERING, not clicking. On desktop Playwright hovers
  // before a click (onMouseEnter opens the menu), then the click's onClick toggles
  // it straight back closed, leaving the logout item clipped inside the
  // h-0/overflow-hidden wrapper so the click never lands. Hovering just opens it.
  await userMenuButton.hover();

  const logoutButton = page.locator(SELECTORS.logoutButton).first();
  await expect(logoutButton).toBeVisible({ timeout: 3000 });
  await logoutButton.click();

  await waitForPageLoad(page);
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
  await waitForPageLoad(page);
}
