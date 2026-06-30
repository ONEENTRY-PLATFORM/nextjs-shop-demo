import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { PAYMENT, ROUTES, SELECTORS } from '../settings';

/**
 * Helpers for driving the checkout → payment flow in E2E tests.
 */

/**
 * Navigates an authenticated session from the cart to the payment page with a
 * payable order. Ensures the delivery address is filled (the Orders API rejects
 * an order with empty `formData`) and proceeds via the "Go to pay" button.
 * @param   {Page}             page - Playwright page object.
 * @returns {Promise<boolean>}      `false` when the cart is empty (no checkout button), so callers can skip.
 */
export async function goToPayment(page: Page): Promise<boolean> {
  await page.goto(ROUTES.cart);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500); // GSAP entrance animations

  const checkoutButton = page.locator(SELECTORS.checkoutButton);
  if (!(await checkoutButton.isVisible().catch(() => false))) {
    return false; // empty cart — nothing to pay for
  }

  // Make sure the delivery address is present; date/time come from the
  // persisted delivery slot on the account.
  const address = page.getByRole('textbox', { name: /address/i }).first();
  if (await address.isVisible().catch(() => false)) {
    const value = await address.inputValue().catch(() => '');
    if (!value) {
      await address.fill(PAYMENT.deliveryAddress);
      await page.waitForTimeout(300);
    }
  }

  await checkoutButton.click();
  await page.waitForURL('**/payment', { timeout: 15000 });
  await page.waitForLoadState('networkidle');
  return true;
}

/**
 * Expands the Stripe payment method (idempotent) and returns its confirm button.
 * @param   {Page}             page - Playwright page object.
 * @returns {Promise<Locator>}      The "Pay with stripe" button locator.
 */
export async function openStripeMethod(page: Page): Promise<Locator> {
  const payButton = page.getByRole('button', { name: /pay with stripe/i });

  // The method may already be expanded (persisted UI state) — only toggle if not.
  if (!(await payButton.isVisible().catch(() => false))) {
    await page.getByRole('heading', { name: 'Stripe', exact: true }).click();
  }

  await expect(payButton).toBeVisible({ timeout: 10000 });
  return payButton;
}
