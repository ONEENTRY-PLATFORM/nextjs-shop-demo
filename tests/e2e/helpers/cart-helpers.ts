import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { SELECTORS } from '../fixtures/test-data';

/**
 * Helper functions for cart operations in E2E tests
 */

/**
 * Opens the cart page by clicking the cart icon or navigating directly
 * @param   {Page}          page - Playwright page object
 * @returns {Promise<void>}      Promise that resolves when the cart page is opened
 */
export async function openCart(page: Page): Promise<void> {
  // Wait for redux-persist to save cart state to localStorage
  await page.waitForTimeout(500);

  // Navigate directly to cart page instead of clicking icon
  // This is more reliable for tests as it ensures proper page load
  await page.goto('/en/cart');

  // Wait for page load and network idle
  await page.waitForLoadState('networkidle');

  // Wait for cart content to be visible
  await expect(page.locator(SELECTORS.cartDrawer)).toBeVisible();

  // Wait for GSAP entrance animations to complete
  // ProductAnimations: delay = index / 10 (max ~0.5s for 5 items)
  // TableRowAnimations: delay = index / 10 (checkout button has index=10, so 1s delay + animation)
  await page.waitForTimeout(2000);
}

/**
 * Gets the cart badge locator (first one if multiple exist)
 * @param   {Page}    page - Playwright page object
 * @returns {Locator}      Cart badge locator
 */
export function getCartBadge(page: Page): Locator {
  // Use .first() to handle cases where badge appears multiple times (desktop + mobile)
  return page.locator(SELECTORS.cartBadge).first();
}

/**
 * Gets the number of items in the cart from the cart icon badge
 * @param   {Page}            page - Playwright page object
 * @returns {Promise<number>}      Number of items in cart
 */
export async function getCartItemCount(page: Page): Promise<number> {
  const badge = getCartBadge(page);

  const isVisible = await badge.isVisible().catch(() => false);
  if (!isVisible) {
    return 0;
  }

  const count = await badge.textContent();
  const trimmedCount = count ? count.trim() : '0';
  const parsedCount = parseInt(trimmedCount, 10);
  return isNaN(parsedCount) ? 0 : parsedCount;
}

/**
 * Adds a product to cart from product card
 * @param {Page}          page        - Playwright page object
 * @param {Promise<void>} productCard - Product card locator
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
 * @param   {Page}          page      - Playwright page object
 * @param   {number}        itemIndex - Index of item to remove (0-based)
 * @returns {Promise<void>}           Promise that resolves when the item is removed
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
 * @param   {Page}          page      - Playwright page object
 * @param   {number}        itemIndex - Index of item to change (0-based)
 * @param   {string}        action    - 'increase' or 'decrease'
 * @returns {Promise<void>}           Promise that resolves when the quantity change is complete
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
  // Wait for quantity update in Redux store
  await page.waitForTimeout(500);
}

/**
 * Gets the current quantity of a cart item
 * @param   {Page}            page      - Playwright page object
 * @param   {number}          itemIndex - Index of item (0-based)
 * @returns {Promise<number>}           Current quantity
 */
export async function getCartItemQuantity(
  page: Page,
  itemIndex: number = 0,
): Promise<number> {
  const cartItems = page.locator(SELECTORS.cartItem);
  const item = cartItems.nth(itemIndex);
  const input = item.locator(SELECTORS.cartItemQuantity);
  // Use inputValue() for <input> elements, not textContent()
  const quantity = await input.inputValue();
  return quantity ? parseInt(quantity, 10) : 0;
}

/**
 * Gets the total price from the cart
 * @param   {Page}            page - Playwright page object
 * @returns {Promise<number>}      Total price as number
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
 * @param   {Page}          page - Playwright page object
 * @returns {Promise<void>}      Promise that resolves when checkout is complete
 */
export async function proceedToCheckout(page: Page): Promise<void> {
  await page.click(SELECTORS.checkoutButton);
  // Wait for navigation or checkout form to appear
  await page.waitForLoadState('networkidle');
}

/**
 * Clears all items from the cart
 * @param   {Page}          page - Playwright page object
 * @returns {Promise<void>}      Promise that resolves when the cart is cleared
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
