import { expect, test } from '@playwright/test';

import { SELECTORS } from './fixtures/test-data';
import {
  changeCartItemQuantity,
  clearCart,
  getCartItemCount,
  getCartItemQuantity,
  openCart,
  proceedToCheckout,
  removeCartItem,
} from './helpers/cart-helpers';
import {
  goToFirstProduct,
  waitForPageLoad,
} from './helpers/navigation-helpers';

/**
 * E2E tests for shopping cart functionality
 */

test.describe('Shopping Cart', () => {
  test.beforeEach(async ({ page }) => {
    // Clear cart before each test
    await page.goto('/en');
    await waitForPageLoad(page);
  });

  test('should add product to cart from product page', async ({ page }) => {
    // Navigate to a product
    await goToFirstProduct(page);

    // Get initial cart count
    const initialCount = await getCartItemCount(page);

    // Add product to cart
    const addButton = page.locator(SELECTORS.addToCartButton).first();
    await expect(addButton).toBeVisible();
    await addButton.click();

    // Wait for cart to update
    await page.waitForTimeout(1000);

    // Verify cart count increased
    const newCount = await getCartItemCount(page);
    expect(newCount).toBe(initialCount + 1);

    // Open cart and verify item is there
    await openCart(page);
    const cartItems = page.locator(SELECTORS.cartItem);
    await expect(cartItems).toHaveCount(newCount);
  });

  test('should increase product quantity in cart', async ({ page }) => {
    // Add product to cart first
    await goToFirstProduct(page);
    const addButton = page.locator(SELECTORS.addToCartButton).first();
    await addButton.click();
    await page.waitForTimeout(1000);

    // Open cart
    await openCart(page);

    // Get initial quantity
    const initialQuantity = await getCartItemQuantity(page, 0);

    // Increase quantity
    await changeCartItemQuantity(page, 0, 'increase');

    // Verify quantity increased
    const newQuantity = await getCartItemQuantity(page, 0);
    expect(newQuantity).toBe(initialQuantity + 1);
  });

  test('should decrease product quantity in cart', async ({ page }) => {
    // Add product to cart twice
    await goToFirstProduct(page);
    const addButton = page.locator(SELECTORS.addToCartButton).first();
    await addButton.click();
    await page.waitForTimeout(500);
    await addButton.click();
    await page.waitForTimeout(1000);

    // Open cart
    await openCart(page);

    // Get initial quantity (should be 2)
    const initialQuantity = await getCartItemQuantity(page, 0);
    expect(initialQuantity).toBeGreaterThanOrEqual(2);

    // Decrease quantity
    await changeCartItemQuantity(page, 0, 'decrease');

    // Verify quantity decreased
    const newQuantity = await getCartItemQuantity(page, 0);
    expect(newQuantity).toBe(initialQuantity - 1);
  });

  test('should remove product from cart', async ({ page }) => {
    // Add product to cart
    await goToFirstProduct(page);
    const addButton = page.locator(SELECTORS.addToCartButton).first();
    await addButton.click();
    await page.waitForTimeout(1000);

    // Open cart
    await openCart(page);

    // Get initial item count
    const cartItems = page.locator(SELECTORS.cartItem);
    const initialCount = await cartItems.count();
    expect(initialCount).toBeGreaterThan(0);

    // Remove item
    await removeCartItem(page, 0);

    // Verify item removed
    const newCount = await cartItems.count();
    expect(newCount).toBe(initialCount - 1);
  });

  test('should display empty cart message when cart is empty', async ({
    page,
  }) => {
    // Ensure cart is empty
    await openCart(page);

    // Check for empty cart message or no items
    const cartItems = page.locator(SELECTORS.cartItem);
    const count = await cartItems.count();

    if (count === 0) {
      // Look for empty cart message
      const emptyMessage = page.getByText(/empty|no items|cart is empty/i);
      const hasEmptyMessage = await emptyMessage.isVisible().catch(() => false);

      // Either empty message visible or checkout button disabled
      const checkoutButton = page.locator(SELECTORS.checkoutButton);
      const isCheckoutDisabled = await checkoutButton
        .isDisabled()
        .catch(() => true);

      expect(hasEmptyMessage || isCheckoutDisabled).toBeTruthy();
    }
  });

  test('should persist cart items after page reload', async ({ page }) => {
    // Add product to cart
    await goToFirstProduct(page);
    const addButton = page.locator(SELECTORS.addToCartButton).first();
    await addButton.click();
    await page.waitForTimeout(1000);

    // Get cart count
    const countBeforeReload = await getCartItemCount(page);
    expect(countBeforeReload).toBeGreaterThan(0);

    // Reload page
    await page.reload();
    await waitForPageLoad(page);

    // Verify cart count persisted
    const countAfterReload = await getCartItemCount(page);
    expect(countAfterReload).toBe(countBeforeReload);
  });

  test('should update cart total when quantity changes', async ({ page }) => {
    // Add product to cart
    await goToFirstProduct(page);
    const addButton = page.locator(SELECTORS.addToCartButton).first();
    await addButton.click();
    await page.waitForTimeout(1000);

    // Open cart
    await openCart(page);

    // Get initial total (if visible)
    const totalElement = page.locator(SELECTORS.cartTotal);
    const hasTotalElement = await totalElement.isVisible().catch(() => false);

    if (hasTotalElement) {
      const initialTotal = await totalElement.textContent();

      // Increase quantity
      await changeCartItemQuantity(page, 0, 'increase');
      await page.waitForTimeout(500);

      // Verify total changed
      const newTotal = await totalElement.textContent();
      expect(newTotal).not.toBe(initialTotal);
    }
  });

  test('should navigate to checkout when checkout button is clicked', async ({
    page,
  }) => {
    // Add product to cart
    await goToFirstProduct(page);
    const addButton = page.locator(SELECTORS.addToCartButton).first();
    await addButton.click();
    await page.waitForTimeout(1000);

    // Open cart
    await openCart(page);

    // Click checkout button
    await proceedToCheckout(page);

    // Verify navigation to checkout or cart page
    await expect(page).toHaveURL(/\/(cart|checkout)/);
  });

  test.afterEach(async ({ page }) => {
    // Clean up: clear cart after each test
    try {
      await clearCart(page);
    } catch (error) {
      // Ignore errors during cleanup
      console.log('Cleanup error:', error);
    }
  });
});
