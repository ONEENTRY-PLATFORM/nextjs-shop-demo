import { expect, test } from '@playwright/test';

import { clearAuthState, signIn } from './helpers/auth-helpers';
import { goToPayment, openStripeMethod } from './helpers/payment-helpers';
import { PAYMENT, ROUTES, TEST_AUTH_USER } from './settings';

/*
 * E2E tests for the Stripe payment flow.
 *
 * Covers the regression where confirming a Stripe order skipped the payment
 * redirect and dropped the user on /orders. The asserted happy path is the
 * app's own responsibility:
 *   confirm → createOrder (201) → createSession (201) → hosted Stripe Checkout.
 *
 * What happens AFTER the hand-off is deliberately not automated:
 *  - the card inputs live in cross-origin Stripe iframes (brittle to drive), and
 *  - on success Stripe redirects to the `success_url` configured on the OneEntry
 *    payment account, currently the hosted demo
 *    `oneentry-nextjs-e-commerce-demo.vercel.app`. Running from localhost the
 *    browser therefore LEAVES localhost (→ Stripe → demo host, which bounces
 *    /orders → home when unauthenticated there).
 * Completing the payment with the Stripe test card 4242 4242 4242 4242 and the
 * landing on that success URL were verified manually during development; to
 * automate further, drive Stripe via its test API/webhooks rather than the
 * hosted UI.
 *
 * Requires TEST_USER_EMAIL / TEST_USER_PASSWORD (see tests/.env) and a delivery
 * slot on the account so the order has non-empty formData.
 */
test.describe('Payment flow (Stripe)', () => {
  test.setTimeout(120000);

  test.afterEach(async ({ page }) => {
    // Return to the app origin before touching localStorage — the page may have
    // navigated cross-origin (Stripe) during the test.
    await page.goto(ROUTES.home).catch(() => {});
    await clearAuthState(page).catch(() => {});
  });

  test('confirming Stripe creates the order and redirects to hosted Stripe Checkout', async ({
    page,
  }) => {
    await signIn(page, TEST_AUTH_USER.email, TEST_AUTH_USER.password);

    const ready = await goToPayment(page);
    test.skip(!ready, 'Cart is empty — nothing to pay for');

    // Capture the createOrder POST result before triggering it.
    const orderResponsePromise = page.waitForResponse(
      (response) =>
        response.url().includes(PAYMENT.createOrderUrlPart) &&
        response.request().method() === 'POST',
      { timeout: 30000 },
    );

    const payButton = await openStripeMethod(page);
    await payButton.click();

    const orderResponse = await orderResponsePromise;
    // 201 proves the order was actually created (not a 400 from a malformed
    // payload — e.g. the old shipping_interval / captcha failures).
    expect(orderResponse.status()).toBe(201);

    // The app must hand off to Stripe (leaving localhost) rather than navigating
    // to /orders — the exact regression this guards against.
    await page.waitForURL(new RegExp(PAYMENT.stripeCheckoutHost), {
      timeout: 30000,
    });
    expect(page.url()).toContain(PAYMENT.stripeCheckoutHost);
    expect(page.url()).not.toContain('/orders');
  });
});
