import { expect, test } from '@playwright/test';

import { signIn } from './helpers/auth-helpers';
import { getCartItemCount } from './helpers/cart-helpers';
import {
  expandOrderRow,
  findRowByStatus,
  getOrderCount,
  getOrderRowToggles,
  getRowActions,
  getRowStatus,
  goToOrders,
} from './helpers/orders-helpers';
import { ALLOW_WRITES, TEST_AUTH_USER } from './settings';

/**
 * E2E tests for order-detail actions on the Orders page.
 *
 * The existing orders.spec.ts only covers the list + auth gate + empty state;
 * this file exercises the interactive detail view: expanding a row and the
 * repeat / cancel / pay actions inside it.
 *
 * All of it is data-dependent — it runs against the live orders of the
 * configured TEST_AUTH_USER, so each test skips gracefully when the account has
 * no order in the required state. The one destructive action (cancel) is also
 * gated behind ALLOW_WRITES.
 */
test.describe('Order Actions', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page, TEST_AUTH_USER.email, TEST_AUTH_USER.password);
    await goToOrders(page);
  });

  test('authenticated user sees the orders table', async ({ page }) => {
    // Column header is always rendered for an authenticated user.
    await expect(
      page.getByText('Status', { exact: false }).first(),
    ).toBeVisible({ timeout: 10000 });
  });

  test('expanding an order row reveals its detail actions', async ({
    page,
  }) => {
    const count = await getOrderCount(page);
    test.skip(count === 0, 'Test account has no orders');

    const toggle = getOrderRowToggles(page).first();
    await expandOrderRow(toggle);

    // At least one action button (repeat/cancel/pay) must be revealed.
    await expect(getRowActions(toggle).first()).toBeVisible({ timeout: 10000 });
  });

  test('repeat order re-adds products to the cart and opens the cart', async ({
    page,
  }) => {
    const count = await getOrderCount(page);
    test.skip(count === 0, 'Test account has no orders');

    // Repeat is only shown for orders whose status is NOT "created".
    const toggle = await findRowByStatus(
      page,
      (s) => s.toLowerCase() !== 'created' && s !== '',
    );
    test.skip(!toggle, 'No non-created order to repeat');

    await expandOrderRow(toggle!);
    await getRowActions(toggle!).first().click();

    // RepeatOrderButton routes to the locale cart after filling it.
    await expect(page).toHaveURL(/\/cart/, { timeout: 10000 });
    expect(await getCartItemCount(page)).toBeGreaterThan(0);
  });

  test('cancel order transitions its status to Canceled', async ({ page }) => {
    test.skip(
      !ALLOW_WRITES,
      'Destructive test — enable with E2E_WRITE_TESTS=1 (cancels a real order)',
    );
    const count = await getOrderCount(page);
    test.skip(count === 0, 'Test account has no orders');

    const toggle = await findRowByStatus(
      page,
      (s) => s.toLowerCase() === 'created',
    );
    test.skip(!toggle, 'No created order available to cancel');

    await expandOrderRow(toggle!);
    // For a created order the first action button is Cancel (rendered before Pay).
    await getRowActions(toggle!).first().click();

    // onStatusChange syncs the list row → its status label becomes "Canceled".
    await expect(async () => {
      expect((await getRowStatus(toggle!)).toLowerCase()).toContain('canceled');
    }).toPass({ timeout: 10000 });
  });
});
