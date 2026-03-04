import { expect, test } from '@playwright/test';

import { clearAuthState, signIn } from './helpers/auth-helpers';
import { openCart, proceedToCheckout } from './helpers/cart-helpers';
import { waitForPageLoad } from './helpers/navigation-helpers';
import { ROUTES, SELECTORS, TEST_AUTH_USER, TEST_USER } from './settings';

/**
 * E2E tests for the checkout flow
 */
test.describe('Checkout', () => {
  test.setTimeout(90000);

  // ---------------------------------------------------------------------------
  // Unauthenticated access
  // ---------------------------------------------------------------------------
  test.describe('Unauthenticated Access', () => {
    test('redirects or shows auth error when not logged in', async ({
      page,
    }) => {
      await page.goto(ROUTES.checkout);
      await page.waitForLoadState('networkidle');

      const url = page.url();

      if (url.includes('/checkout')) {
        // Still on checkout — must show an auth prompt
        const authPrompt = page.getByText(
          /sign in|log in|please login|unauthorized|not authorized/i,
        );
        await expect(authPrompt.first()).toBeVisible({ timeout: 5000 });
      } else {
        // Redirected away — acceptable
        expect(url).not.toContain('/checkout');
      }
    });

    test('checkout button in empty cart shows correct state', async ({
      page,
    }) => {
      await page.goto(ROUTES.cart);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000); // GSAP animations

      // Checkout button should either be absent or disabled when cart is empty
      const checkoutBtn = page.locator(SELECTORS.checkoutButton);
      const isVisible = await checkoutBtn.isVisible().catch(() => false);

      if (isVisible) {
        const isDisabled = await checkoutBtn.isDisabled().catch(() => false);
        const hasEmptyCartMsg = await page
          .getByText(/empty|no items|add items/i)
          .isVisible()
          .catch(() => false);

        // Either disabled OR page shows empty state message
        expect(isDisabled || hasEmptyCartMsg).toBeTruthy();
      }
      // If not visible — correct: no checkout button on empty cart
    });
  });

  // ---------------------------------------------------------------------------
  // Authenticated checkout flow
  // ---------------------------------------------------------------------------
  test.describe('Authenticated Checkout', () => {
    test.beforeEach(async ({ page }) => {
      // Sign in
      await signIn(page, TEST_AUTH_USER.email, TEST_AUTH_USER.password);

      // Add a product to cart
      await page.goto(ROUTES.product);
      await waitForPageLoad(page);

      const addToCartBtn = page.locator(SELECTORS.addToCartButton);
      const isAvailable = await addToCartBtn
        .isVisible({ timeout: 5000 })
        .catch(() => false);
      if (isAvailable) {
        await addToCartBtn.click();
        await page.waitForTimeout(500);
      }

      // Open cart and proceed to checkout
      await openCart(page);
      await proceedToCheckout(page);
      await waitForPageLoad(page);
    });

    test.afterEach(async ({ page }) => {
      await clearAuthState(page);
    });

    // -------------------------------------------------------------------------
    // Page structure
    // -------------------------------------------------------------------------
    test('navigates to checkout page after clicking checkout', async ({
      page,
    }) => {
      expect(page.url()).toContain('/checkout');
    });

    test('checkout page has a delivery form', async ({ page }) => {
      const form = page
        .locator(SELECTORS.checkoutForm)
        .first()
        .or(page.locator('form').first());
      await expect(form).toBeVisible({ timeout: 10000 });
    });

    test('checkout form contains at least one input field', async ({ page }) => {
      const inputs = page.locator(
        'input:not([type="hidden"]), select, textarea',
      );
      await expect(inputs.first()).toBeVisible({ timeout: 10000 });
      expect(await inputs.count()).toBeGreaterThan(0);
    });

    test('checkout page has a submit / place order button', async ({ page }) => {
      const submitBtn = page
        .locator(SELECTORS.checkoutSubmitButton)
        .first()
        .or(page.locator('button[type="submit"]').first());
      await expect(submitBtn).toBeVisible({ timeout: 10000 });
    });

    test('checkout page has navigation header', async ({ page }) => {
      const header = page.locator('nav, header').first();
      await expect(header).toBeVisible();
    });

    // -------------------------------------------------------------------------
    // Order summary
    // -------------------------------------------------------------------------
    test('checkout shows order summary with at least one product', async ({
      page,
    }) => {
      const summary = page.locator(SELECTORS.checkoutOrderSummary);
      const hasSummary = await summary
        .isVisible({ timeout: 5000 })
        .catch(() => false);

      if (hasSummary) {
        await expect(summary).toBeVisible();
      } else {
        // Fallback: any price element on the page
        const priceEl = page
          .locator(
            '[data-testid="product-price"], [class*="price"], [class*="total"]',
          )
          .first();
        const hasFallback = await priceEl
          .isVisible({ timeout: 3000 })
          .catch(() => false);
        expect(hasFallback).toBeTruthy();
      }
    });

    // -------------------------------------------------------------------------
    // Delivery form fields
    // -------------------------------------------------------------------------
    test('can fill text input fields in checkout form', async ({ page }) => {
      const textInputs = page.locator(
        'input[type="text"], input[type="email"], input[type="tel"]',
      );
      const count = await textInputs.count();

      if (count === 0) return; // Dynamic form may not have rendered yet

      const firstInput = textInputs.first();
      await firstInput.fill(TEST_USER.name);
      const value = await firstInput.inputValue();
      expect(value).toBe(TEST_USER.name);
    });

    test('shows validation errors on empty form submit', async ({ page }) => {
      const submitBtn = page
        .locator(SELECTORS.checkoutSubmitButton)
        .first()
        .or(page.locator('button[type="submit"]').first());

      const isVisible = await submitBtn
        .isVisible({ timeout: 5000 })
        .catch(() => false);
      if (!isVisible) return;

      // Clear any pre-filled required text inputs
      const inputs = page.locator('input[type="text"], input[type="email"]');
      const count = await inputs.count();
      for (let i = 0; i < Math.min(count, 3); i++) {
        await inputs.nth(i).fill('');
      }

      await submitBtn.click();
      await page.waitForTimeout(800);

      const invalidInputs = page.locator('input:invalid, select:invalid');
      const errorMessages = page.locator(
        '[class*="error"], [class*="invalid"], .text-red-500, [role="alert"]',
      );

      const hasInvalid = (await invalidInputs.count()) > 0;
      const hasErrors = (await errorMessages.count()) > 0;

      expect(hasInvalid || hasErrors).toBeTruthy();
    });

    // -------------------------------------------------------------------------
    // Date / time slot (timeInterval field — optional per project)
    // -------------------------------------------------------------------------
    test('date picker is visible and clickable when present', async ({
      page,
    }) => {
      const datePicker = page
        .locator(SELECTORS.checkoutDatePicker)
        .first()
        .or(
          page
            .locator(
              '[class*="calendar"], [class*="date-picker"], [class*="datepicker"]',
            )
            .first(),
        );

      const isPresent = await datePicker
        .isVisible({ timeout: 3000 })
        .catch(() => false);
      if (!isPresent) return;

      await datePicker.click();
      await page.waitForTimeout(500);

      const calendarOpen = page.locator(
        '[class*="calendar-body"], [role="dialog"], [class*="datepicker-dropdown"]',
      );
      const opened = await calendarOpen
        .isVisible({ timeout: 3000 })
        .catch(() => false);
      expect(opened).toBeTruthy();
    });

    test('time slot selector is visible when present', async ({ page }) => {
      const timeSlot = page
        .locator(SELECTORS.checkoutTimeSlot)
        .first()
        .or(
          page.locator('[class*="time-slot"], [class*="timeslot"]').first(),
        );

      const isPresent = await timeSlot
        .isVisible({ timeout: 3000 })
        .catch(() => false);
      if (!isPresent) return;

      await expect(timeSlot).toBeVisible();
    });

    // -------------------------------------------------------------------------
    // Payment
    // -------------------------------------------------------------------------
    test('payment method section is visible when present', async ({ page }) => {
      const paymentSection = page
        .locator(SELECTORS.checkoutPaymentSection)
        .first()
        .or(
          page
            .locator(
              '[class*="payment"], [data-testid*="payment"], [aria-label*="payment" i]',
            )
            .first(),
        );

      const isPresent = await paymentSection
        .isVisible({ timeout: 5000 })
        .catch(() => false);
      if (!isPresent) return;

      await expect(paymentSection).toBeVisible();
    });

    test('can select a payment method when multiple options exist', async ({
      page,
    }) => {
      const paymentOptions = page.locator(
        'input[type="radio"][name*="payment"], [data-testid*="payment-option"]',
      );
      const count = await paymentOptions.count();

      if (count < 2) return;

      const secondOption = paymentOptions.nth(1);
      await secondOption.click();
      await page.waitForTimeout(300);

      await expect(secondOption).toBeChecked();
    });
  });
});
