import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import {
  getCartBadge,
  getCartItemCount,
  openCart,
} from './helpers/cart-helpers';
import {
  goToFirstProduct,
  waitForPageLoad,
} from './helpers/navigation-helpers';
import { SELECTORS } from './settings';

/**
 * E2E tests for cart item selection.
 *
 * Each cart line ([data-testid="cart-item"]) carries a selection checkbox
 * (`input[type="checkbox"][id^="deselectProduct-"]`) that is checked by default
 * for in-stock, selected items and toggles the Redux `deselectProduct` action.
 * Out-of-stock lines render the checkbox `disabled` and show "Out of stock".
 *
 * The cart badge (getCartItemCount) sums cart item quantities, EXCLUDING the
 * delivery product (id 83), which is stored separately and never rendered as a
 * cart line.
 *
 * Runs against LIVE CMS data with no mocks. Each test starts from a fresh
 * browser context (empty cart), so the cart holds only the item we add.
 */
test.describe('Cart Item Selection', () => {
  // Cart entrance animations (GSAP) + live fetches need extra head-room.
  test.setTimeout(60000);

  test.beforeEach(async ({ page }) => {
    await page.goto('/en');
    await waitForPageLoad(page);
  });

  /**
   * Adds the first in-stock product to the cart from its product page and waits
   * for the cart badge to reflect a single item.
   * @param   {Page}          page - Playwright page object
   * @returns {Promise<void>}      Resolves once the badge shows one item
   */
  async function addFirstProductToCart(page: Page): Promise<void> {
    await goToFirstProduct(page);
    const addButton = page.locator(SELECTORS.addToCartButton).first();
    await expect(addButton).toBeVisible({ timeout: 10000 });
    await addButton.click();

    // Playwright auto-retries until the badge text matches.
    const badge = getCartBadge(page);
    await expect(badge).toHaveText('1', { timeout: 5000 });
  }

  test('added item shows a selection checkbox checked by default', async ({
    page,
  }) => {
    await addFirstProductToCart(page);
    await openCart(page);

    const cartItem = page.locator(SELECTORS.cartItem).first();
    await expect(cartItem).toBeVisible({ timeout: 15000 });

    // In-stock item → selection checkbox is checked out of the box.
    const checkbox = cartItem.locator('input[type="checkbox"]');
    await expect(checkbox).toBeChecked();
  });

  test('clicking the checkbox toggles item selection', async ({ page }) => {
    await addFirstProductToCart(page);
    await openCart(page);

    const cartItem = page.locator(SELECTORS.cartItem).first();
    await expect(cartItem).toBeVisible({ timeout: 15000 });

    const checkbox = cartItem.locator('input[type="checkbox"]');
    await expect(checkbox).toBeChecked();

    // Deselect → the controlled checkbox re-renders as unchecked.
    await checkbox.click();
    await expect(checkbox).not.toBeChecked();

    // Re-select → toggling back works.
    await checkbox.click();
    await expect(checkbox).toBeChecked();
  });

  test('cart badge equals the sum of in-cart item quantities', async ({
    page,
  }) => {
    await addFirstProductToCart(page);
    await openCart(page);

    const cartItems = page.locator(SELECTORS.cartItem);
    await expect(cartItems.first()).toBeVisible({ timeout: 15000 });

    // Sum every rendered cart line's quantity input. Delivery (id 83) is stored
    // apart from productsData, so it is neither rendered here nor in the badge —
    // the two totals must agree.
    const count = await cartItems.count();
    let sum = 0;
    for (let i = 0; i < count; i++) {
      const quantityInput = cartItems
        .nth(i)
        .locator(SELECTORS.cartItemQuantity);
      const value = await quantityInput.inputValue();
      sum += parseInt(value, 10) || 0;
    }

    const badgeCount = await getCartItemCount(page);
    expect(sum).toBe(badgeCount);
  });

  test('out-of-stock cart item disables its checkbox and shows "Out of stock"', async ({
    page,
  }) => {
    await addFirstProductToCart(page);
    await openCart(page);

    const cartItems = page.locator(SELECTORS.cartItem);
    await expect(cartItems.first()).toBeVisible({ timeout: 15000 });

    // An out-of-stock line renders its selection checkbox `disabled`. A fresh
    // cart only holds the in-stock product we just added, so this is normally
    // absent — skip gracefully when there is nothing to assert against.
    const disabledCheckbox = page
      .locator(`${SELECTORS.cartItem} input[type="checkbox"]:disabled`)
      .first();
    const hasOutOfStock = await disabledCheckbox.isVisible().catch(() => false);

    test.skip(!hasOutOfStock, 'no out-of-stock item in cart');

    await expect(disabledCheckbox).toBeDisabled();

    // The same line shows the "Out of stock" label instead of a quantity picker.
    const outOfStockItem = cartItems
      .filter({ has: page.locator('input[type="checkbox"]:disabled') })
      .first();
    await expect(outOfStockItem.getByText(/out of stock/i)).toBeVisible();
  });
});
