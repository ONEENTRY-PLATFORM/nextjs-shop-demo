import { expect, test } from '@playwright/test';

import {
  changeCartItemQuantity,
  getCartBadge,
  getCartItemCount,
  getCartItemQuantity,
  openCart,
  proceedToCheckout,
} from './helpers/cart-helpers';
import {
  goToFirstProduct,
  waitForPageLoad,
} from './helpers/navigation-helpers';
import { SELECTORS } from './settings';

test.describe('Checkout', () => {
  // Increase timeout for cart tests due to animations
  test.setTimeout(60000);
  test.beforeEach(async ({ page }) => {
    await page.goto('/en');
    await waitForPageLoad(page);
  });
});
