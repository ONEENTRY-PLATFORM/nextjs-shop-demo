import type { Locator, Page } from '@playwright/test';

import { ROUTES } from '../settings';
import { waitForPageLoad } from './navigation-helpers';

/**
 * Helper functions for the authenticated Orders page (list + expandable detail
 * with repeat / cancel / pay actions).
 *
 * The action buttons (RepeatOrderButton / CancelOrderButton / PayOrderButton)
 * all share the exact same `btn btn-sm btn-o btn-o-primary` classes and their
 * labels come from CMS settings, so they can't be told apart by selector alone —
 * only by the row's status (a 'created' order shows Cancel [+Pay]; any other
 * status shows Repeat). These helpers expose the row status so specs can branch.
 */

/** Row summary toggles: the non-`.btn` buttons inside the orders table body. */
const ROW_TOGGLE = '.orders-table__body button:not(.btn)';
/** The three shared action buttons all carry this class. */
const ACTION_BUTTON = 'button.btn-o-primary';

/**
 * Navigate to the orders page.
 * @param   {Page}          page - Playwright page object
 * @returns {Promise<void>}      Resolves after the page shell has loaded
 */
export async function goToOrders(page: Page): Promise<void> {
  await page.goto(ROUTES.orders);
  await waitForPageLoad(page);
}

/**
 * All expandable order-row toggles currently rendered.
 * @param   {Page}    page - Playwright page object
 * @returns {Locator}      Locator matching every row toggle
 */
export function getOrderRowToggles(page: Page): Locator {
  return page.locator(ROW_TOGGLE);
}

/**
 * Number of order rows in the list (0 when the account has no orders).
 * @param   {Page}            page - Playwright page object
 * @returns {Promise<number>}      Count of order rows
 */
export async function getOrderCount(page: Page): Promise<number> {
  // The list loads client-side after auth; wait for either a row or the empty state.
  await page
    .locator(`${ROW_TOGGLE}, .orders-table__body:has-text("")`)
    .first()
    .waitFor({ state: 'visible', timeout: 15000 })
    .catch(() => {});
  return getOrderRowToggles(page).count();
}

/**
 * Read the status column text of a row toggle (e.g. "Created", "Canceled").
 * @param   {Locator}         toggle - A row toggle locator
 * @returns {Promise<string>}        Trimmed status label
 */
export async function getRowStatus(toggle: Locator): Promise<string> {
  // The toggle has three column divs; status is the last one.
  const text = await toggle.locator('div').last().textContent();
  return (text || '').trim();
}

/**
 * Expand a row and wait for its detail (action buttons) to become visible.
 * @param   {Locator}       toggle - The row toggle to expand
 * @returns {Promise<void>}        Resolves once the detail area is revealed
 */
export async function expandOrderRow(toggle: Locator): Promise<void> {
  await toggle.scrollIntoViewIfNeeded();
  await toggle.click();
  // OrderPage lazy-loads via RTK Query, then reveals action buttons under a GSAP
  // height/opacity wrapper — wait for the first action to actually be visible.
  await getRowActions(toggle)
    .first()
    .waitFor({ state: 'visible', timeout: 12000 })
    .catch(() => {});
}

/**
 * The action buttons (repeat/cancel/pay) belonging to a specific row.
 * Scoped to the row's own animation wrapper (the toggle's parent), which also
 * holds that row's OrderPage.
 * @param   {Locator} toggle - The row toggle locator
 * @returns {Locator}        Locator matching that row's action buttons
 */
export function getRowActions(toggle: Locator): Locator {
  return toggle.locator('xpath=..').locator(ACTION_BUTTON);
}

/**
 * Find the first row toggle matching a status predicate.
 * @param   {Page}                        page - Playwright page object
 * @param   {(status: string) => boolean} pred - Predicate over the status label
 * @returns {Promise<Locator | null>}          The matching toggle, or null
 */
export async function findRowByStatus(
  page: Page,
  pred: (status: string) => boolean,
): Promise<Locator | null> {
  const toggles = getOrderRowToggles(page);
  const count = await toggles.count();
  for (let i = 0; i < count; i++) {
    const toggle = toggles.nth(i);
    const status = await getRowStatus(toggle);
    if (pred(status)) {
      return toggle;
    }
  }
  return null;
}
