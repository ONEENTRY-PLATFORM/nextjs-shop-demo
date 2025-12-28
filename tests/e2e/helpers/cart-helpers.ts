import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { SELECTORS } from '../fixtures/test-data';

/**
 * Helper functions for cart operations in E2E tests
 */

/**
 * Opens the cart drawer
 * @param page - Playwright page object
 */
export async function openCart(page: Page): Promise<void> {
  await page.click(SELECTORS.cartIcon);
  await expect(page.locator(SELECTORS.cartDrawer)).toBeVisible();
}

/**
 * Gets the number of items in the cart from the cart icon badge
 * @param page - Playwright page object
 * @returns    Number of items in cart
 */
export async function getCartItemCount(page: Page): Promise<number> {
  const cartIcon = page.locator(SELECTORS.cartIcon);
  const badge = cartIcon.locator('[data-testid="cart-badge"]');

  const isVisible = await badge.isVisible().catch(() => false);
  if (!isVisible) {
    return 0;
  }

  const count = await badge.textContent();
  return count ? parseInt(count, 10) : 0;
}

/**
 * Adds a product to cart from product card
 * @param page        - Playwright page object
 * @param productCard - Product card locator
 */
export async function addToCartFromCard(
  page: Page,
  productCard: Locator,
): Promise<void> {
  const addButton = productCard.locator(SELECTORS.addToCartButton);
  await addButton.click();
  // Wait for cart to update
  await page.waitForTimeout(500);
}

/**
 * Removes an item from cart
 * @param page      - Playwright page object
 * @param itemIndex - Index of item to remove (0-based)
 */
export async function removeCartItem(
  page: Page,
  itemIndex: number = 0,
): Promise<void> {
  const cartItems = page.locator(SELECTORS.cartItem);
  const item = cartItems.nth(itemIndex);
  const removeButton = item.locator(SELECTORS.cartItemRemove);
  await removeButton.click();
  // Wait for removal animation
  await page.waitForTimeout(500);
}

/**
 * Changes the quantity of a cart item
 * @param page      - Playwright page object
 * @param itemIndex - Index of item to change (0-based)
 * @param action    - 'increase' or 'decrease'
 */
export async function changeCartItemQuantity(
  page: Page,
  itemIndex: number,
  action: 'increase' | 'decrease',
): Promise<void> {
  const cartItems = page.locator(SELECTORS.cartItem);
  const item = cartItems.nth(itemIndex);
  const button =
    action === 'increase'
      ? item.locator(SELECTORS.increaseQuantityButton)
      : item.locator(SELECTORS.decreaseQuantityButton);

  await button.click();
  // Wait for quantity update
  await page.waitForTimeout(300);
}

/**
 * Gets the current quantity of a cart item
 * @param page      - Playwright page object
 * @param itemIndex - Index of item (0-based)
 * @returns         Current quantity
 */
export async function getCartItemQuantity(
  page: Page,
  itemIndex: number = 0,
): Promise<number> {
  const cartItems = page.locator(SELECTORS.cartItem);
  const item = cartItems.nth(itemIndex);
  const quantity = await item.locator(SELECTORS.cartItemQuantity).textContent();
  return quantity ? parseInt(quantity, 10) : 0;
}

/**
 * Gets the total price from the cart
 * @param page - Playwright page object
 * @returns    Total price as number
 */
export async function getCartTotal(page: Page): Promise<number> {
  const totalText = await page.locator(SELECTORS.cartTotal).textContent();
  if (!totalText) return 0;

  // Extract numbers from text (handles currency symbols)
  const match = totalText.match(/[\d.,]+/);
  return match ? parseFloat(match[0].replace(',', '')) : 0;
}

/**
 * Proceeds to checkout from cart
 * @param page - Playwright page object
 */
export async function proceedToCheckout(page: Page): Promise<void> {
  await page.click(SELECTORS.checkoutButton);
  // Wait for navigation or checkout form to appear
  await page.waitForLoadState('networkidle');
}

/**
 * Clears all items from the cart
 * @param page - Playwright page object
 */
export async function clearCart(page: Page): Promise<void> {
  await openCart(page);

  let cartItems = page.locator(SELECTORS.cartItem);
  let count = await cartItems.count();

  while (count > 0) {
    await removeCartItem(page, 0);
    cartItems = page.locator(SELECTORS.cartItem);
    count = await cartItems.count();
  }
}
