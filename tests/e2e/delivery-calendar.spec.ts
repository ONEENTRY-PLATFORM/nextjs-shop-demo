import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { openCart } from './helpers/cart-helpers';
import { goToFirstProduct } from './helpers/navigation-helpers';
import { SELECTORS } from './settings';

/**
 * E2E tests for the delivery date/time CALENDAR picker.
 *
 * The calendar is opened from the CART page: the delivery form
 * (`[data-testid="checkout-form"]`, component DeliveryForm) renders readonly
 * text inputs (DeliveryTableRow) whose onClick mounts CalendarForm (react-calendar)
 * inside the shared drawer host `#modalBody`. Clicking the form's `Apply` button
 * writes the selection to Redux and closes the drawer.
 *
 * The suite runs against LIVE CMS data with no mocks — whether the delivery
 * form exposes calendar fields depends on the CMS `order` form config, so tests
 * skip gracefully when that data/UI is absent.
 */

/** Locator for the delivery calendar fields inside the checkout (delivery) form. */
const DELIVERY_READONLY_INPUT = '[data-testid="checkout-form"] input[readonly]';

/**
 * Seed the cart with the first in-stock product and open the cart page.
 *
 * The cart contents (and therefore the delivery form with its calendar fields)
 * render CLIENT-SIDE after hydration + redux-persist rehydration, so a real
 * cart item is added first to make the delivery form reliably present.
 * @param   {Page}          page - Playwright page object
 * @returns {Promise<void>}      Resolves once the cart page has loaded
 */
async function seedCartAndOpen(page: Page): Promise<void> {
  await goToFirstProduct(page);

  // The add-to-cart button fades in via GSAP, so wait for it before clicking
  // (instant isVisible() would race the entrance animation).
  const addButton = page.locator(SELECTORS.addToCartButton).first();
  await expect(addButton).toBeVisible({ timeout: 15000 });
  await addButton.click();

  // Give redux-persist a moment to write the cart item to localStorage before
  // we navigate away — openCart rehydrates the cart from there.
  await page.waitForTimeout(500);

  await openCart(page);
}

/**
 * Open the delivery calendar drawer, or skip the test when no calendar field
 * is configured in the CMS `order` form.
 *
 * Returns the first readonly delivery input's locator only after the calendar
 * (`#modalBody` + `.react-calendar`) has actually rendered.
 * @param   {Page}          page - Playwright page object
 * @returns {Promise<void>}      Resolves with the calendar open and visible
 */
async function openDeliveryCalendar(page: Page): Promise<void> {
  const dateField = page.locator(DELIVERY_READONLY_INPUT).first();

  // Delivery rows fade in via GSAP (autoAlpha); wait for the field rather than
  // reading visibility instantly. Absence means the calendar field is not
  // configured for this project — skip instead of failing.
  const hasField = await dateField
    .waitFor({ state: 'visible', timeout: 8000 })
    .then(() => true)
    .catch(() => false);
  test.skip(!hasField, 'calendar delivery field not configured');

  // Clicking the readonly input opens the shared drawer with CalendarForm.
  await dateField.click();

  await expect(page.locator('#modalBody')).toBeVisible({ timeout: 10000 });
  await expect(page.locator('.react-calendar')).toBeVisible({ timeout: 10000 });
}

test.describe('Delivery Calendar', () => {
  // Seeding the cart + navigation + GSAP entrance animations are slow; give the
  // whole flow generous headroom (matches the checkout suite).
  test.setTimeout(90000);

  test('opening a delivery field opens the calendar', async ({ page }) => {
    await seedCartAndOpen(page);
    await openDeliveryCalendar(page);

    // Assertions already made inside openDeliveryCalendar; re-assert the
    // calendar container explicitly for a clear, self-documenting expectation.
    await expect(page.locator('.react-calendar')).toBeVisible();
  });

  test('selecting an enabled day and clicking Apply closes the drawer', async ({
    page,
  }) => {
    await seedCartAndOpen(page);
    await openDeliveryCalendar(page);

    // Past days (before minDate = today) and CMS holidays carry the `disabled`
    // attribute; :not([disabled]) selects a genuinely selectable day tile.
    const enabledDay = page
      .locator('.react-calendar__month-view__days__day:not([disabled])')
      .first();
    await expect(enabledDay).toBeVisible({ timeout: 8000 });
    // .click() auto-waits for the GSAP scale-in entrance to settle (stable box).
    await enabledDay.click();

    // The Apply button is a real <button type="button">Apply</button>; scope to
    // the modal so unrelated "Apply" buttons elsewhere on the page can't match.
    const applyButton = page
      .locator('#modalBody')
      .getByRole('button', { name: 'Apply', exact: true });
    await expect(applyButton).toBeVisible({ timeout: 8000 });
    await applyButton.click();

    // Apply dispatches setTransition('close'); the drawer animates out and
    // ModalAnimations unmounts #modalBody (open=false) → element detaches.
    await expect(page.locator('#modalBody')).toBeHidden({ timeout: 15000 });
  });

  test('time slots are optional and the apply flow still works', async ({
    page,
  }) => {
    await seedCartAndOpen(page);
    await openDeliveryCalendar(page);

    // Select a valid day first so an Apply carries a concrete date.
    const enabledDay = page
      .locator('.react-calendar__month-view__days__day:not([disabled])')
      .first();
    await expect(enabledDay).toBeVisible({ timeout: 8000 });
    await enabledDay.click();

    // Time slots (TimeSlot renders a <button><time>…</time></button>) MAY be
    // empty depending on the CMS `shipping_interval` schedule — tolerate zero.
    const timeSlots = page.locator('#modalBody button:has(time)');
    const slotCount = await timeSlots.count();
    if (slotCount > 0) {
      // If a slot exists it must be selectable; click the first one.
      await timeSlots.first().click();
    }

    // Regardless of whether any time slot was present, the calendar + Apply
    // flow must still close the drawer.
    const applyButton = page
      .locator('#modalBody')
      .getByRole('button', { name: 'Apply', exact: true });
    await expect(applyButton).toBeVisible({ timeout: 8000 });
    await applyButton.click();

    await expect(page.locator('#modalBody')).toBeHidden({ timeout: 15000 });
  });
});
