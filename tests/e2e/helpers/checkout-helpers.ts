import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { SELECTORS, TEST_USER } from '../fixtures/test-data';

/**
 * Helper functions for checkout operations in E2E tests
 */

/**
 * Fills the checkout form with test data
 * @param page     - Playwright page object
 * @param userData - Optional user data, defaults to TEST_USER
 */
export async function fillCheckoutForm(
  page: Page,
  userData = TEST_USER,
): Promise<void> {
  // Wait for form to be visible
  await expect(page.locator(SELECTORS.checkoutForm)).toBeVisible();

  // Fill form fields
  await page.fill(SELECTORS.nameInput, userData.name);
  await page.fill(SELECTORS.emailInput, userData.email);
  await page.fill(SELECTORS.phoneInput, userData.phone);
  await page.fill(SELECTORS.addressInput, userData.address);

  // Additional fields may vary, handle gracefully
  const cityInput = page.locator('[data-testid="city-input"]');
  if (await cityInput.isVisible().catch(() => false)) {
    await cityInput.fill(userData.city);
  }

  const zipInput = page.locator('[data-testid="zip-input"]');
  if (await zipInput.isVisible().catch(() => false)) {
    await zipInput.fill(userData.zip);
  }
}

/**
 * Submits the checkout form
 * @param page - Playwright page object
 */
export async function submitCheckoutForm(page: Page): Promise<void> {
  await page.click(SELECTORS.submitOrderButton);
  // Wait for submission to complete
  await page.waitForLoadState('networkidle');
}

/**
 * Completes the entire checkout process
 * @param page     - Playwright page object
 * @param userData - Optional user data, defaults to TEST_USER
 */
export async function completeCheckout(
  page: Page,
  userData = TEST_USER,
): Promise<void> {
  await fillCheckoutForm(page, userData);
  await submitCheckoutForm(page);
}

/**
 * Verifies that checkout was successful
 * @param page - Playwright page object
 */
export async function verifyCheckoutSuccess(page: Page): Promise<void> {
  // Check for success message or redirect to success page
  const successMessage = page.locator(SELECTORS.successMessage);
  const isSuccessMessageVisible = await successMessage
    .isVisible({ timeout: 10000 })
    .catch(() => false);

  const isOnOrdersPage = page.url().includes('/orders');

  // Either success message should be visible OR redirected to orders page
  expect(isSuccessMessageVisible || isOnOrdersPage).toBeTruthy();
}

/**
 * Verifies form validation errors
 * @param page - Playwright page object
 */
export async function verifyFormValidation(page: Page): Promise<void> {
  // Click submit without filling form
  await page.click(SELECTORS.submitOrderButton);

  // Check for error messages or HTML5 validation
  const errorMessage = page.locator(SELECTORS.errorMessage);
  const hasError = await errorMessage.isVisible({ timeout: 2000 }).catch(() => {
    // If custom error not visible, check for HTML5 validation
    return page.evaluate(() => {
      const form = document.querySelector('form');
      return form ? !form.checkValidity() : false;
    });
  });

  expect(hasError).toBeTruthy();
}

/**
 * Checks if checkout button is enabled
 * @param page - Playwright page object
 * @returns    True if enabled, false otherwise
 */
export async function isCheckoutEnabled(page: Page): Promise<boolean> {
  const checkoutButton = page.locator(SELECTORS.checkoutButton);
  return await checkoutButton.isEnabled();
}
