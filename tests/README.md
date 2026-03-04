# E2E Tests

This directory contains End-to-End (E2E) tests for the OneEntry Next.js Shop using Playwright.

## Overview

The E2E tests cover critical user flows in the e-commerce application:

- **Auth**: Sign in, sign out, registration form, protected routes
- **Product**: Product page structure, add to cart, quantity selector, favorites on product page
- **Cart**: Adding/removing products, changing quantities, cart persistence
- **Checkout**: Order placement, form validation, payment flow
- **Favorites**: Adding/removing favorites, wishlist management

## Project Structure

```text
tests/
├── e2e/
│   ├── helpers/
│   │   ├── auth-helpers.ts      # Auth-related helper functions
│   │   ├── cart-helpers.ts      # Cart-related helper functions
│   │   ├── checkout-helpers.ts  # Checkout-related helper functions
│   │   ├── favorites-helpers.ts # Favorites helper functions
│   │   └── navigation-helpers.ts # Navigation helper functions
│   ├── settings.ts              # Test data, selectors and routes
│   ├── auth.spec.ts             # Authentication tests
│   ├── cart.spec.ts             # Cart functionality tests
│   ├── checkout.spec.ts         # Checkout process tests
│   ├── favorites.spec.ts        # Favorites/wishlist tests
│   └── product.spec.ts          # Single product page tests
└── README.md                     # This file
```

## Prerequisites

Before running tests, ensure:

1. Node.js >= 22.11.0 is installed
2. Dependencies are installed: `npm install`
3. Playwright browsers are installed: `npx playwright install`

## Running Tests

### Run all E2E tests (headless mode)

```bash
npm run test:e2e
```

### Run tests with UI mode (recommended for development)

```bash
npm run test:e2e:ui
```

### Run tests in headed mode (see browser)

```bash
npm run test:e2e:headed
```

### Debug tests

```bash
npm run test:e2e:debug
```

### View test report

```bash
npm run test:e2e:report
```

### Run tests on specific browsers

```bash
npm run test:e2e:chromium  # Run on Chrome only
npm run test:e2e:firefox   # Run on Firefox only
npm run test:e2e:webkit    # Run on Safari only
```

### Run specific test file

```bash
npx playwright test cart.spec.ts
```

### Run specific test

```bash
npx playwright test -g "should add product to cart"
```

## Test Configuration

The Playwright configuration is in `playwright.config.ts` at the project root.

Key settings:

- **Base URL**: `http://localhost:3000` (configurable via `BASE_URL` env var)
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Reporters**: HTML, List, JSON
- **Retries**: 2 on CI, 0 locally
- **Video**: Captured on failure
- **Screenshots**: Captured on failure

## Environment Variables

You can customize test behavior with environment variables:

```bash
# Run against production
BASE_URL=https://your-production-url.com npm run test:e2e

# Run on CI (enables retries)
CI=true npm run test:e2e

# Auth test credentials (required for sign-in/sign-out tests)
TEST_USER_EMAIL=your-test-user@example.com TEST_USER_PASSWORD=YourPassword123! npm run test:e2e
```

> Auth tests require a real registered user in your OneEntry project.
> Without `TEST_USER_EMAIL` / `TEST_USER_PASSWORD` the defaults (`test@example.com` / `TestPassword123!`) are used, which will cause sign-in tests to fail unless such a user exists.

## Writing New Tests

### 1. Use Helper Functions

Instead of writing low-level Playwright commands, use the helper functions:

```typescript
import { openCart, addToCartFromCard } from './helpers/cart-helpers';
import { goToFirstProduct } from './helpers/navigation-helpers';

test('my test', async ({ page }) => {
  await goToFirstProduct(page);
  // ... test logic
});
```

### 2. Use Test Data from Fixtures

```typescript
import { SELECTORS, TEST_USER, ROUTES } from './fixtures/test-data';

await page.click(SELECTORS.addToCartButton);
await fillCheckoutForm(page, TEST_USER);
```

### 3. Follow Test Structure

```typescript
test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup before each test
  });

  test('should do something', async ({ page }) => {
    // Arrange
    // Act
    // Assert
  });

  test.afterEach(async ({ page }) => {
    // Cleanup after each test
  });
});
```

## Important Notes

### Data Test IDs

The tests rely on `data-testid` attributes in the components. If you add new features, make sure to add appropriate test IDs:

```tsx
<button data-testid="add-to-cart-button">Add to Cart</button>
```

Update the `SELECTORS` object in `tests/e2e/fixtures/test-data.ts` accordingly.

### Test Independence

Each test should be independent and not rely on other tests. Use `beforeEach` and `afterEach` hooks for setup and cleanup.

### Async/Await

Always use `await` with Playwright commands. Most Playwright APIs are asynchronous.

### Waiting Strategies

Prefer automatic waiting over manual waits:

```typescript
// Good - Playwright will wait automatically
await expect(page.locator(SELECTORS.cartItem)).toBeVisible();

// Avoid - Manual timeout
await page.waitForTimeout(1000);
```

Use manual waits (`page.waitForTimeout()`) only when absolutely necessary (e.g., waiting for animations).

### Error Handling

Use `.catch()` for optional elements that might not exist:

```typescript
const isVisible = await element.isVisible().catch(() => false);
if (isVisible) {
  // Handle visible case
}
```

## Test Coverage

Current test coverage:

### Product Page Tests (13 tests)

- ✅ Display product title
- ✅ Display product image
- ✅ Display product price
- ✅ Add-to-cart button or out-of-stock indicator
- ✅ Favorites button visible
- ✅ Correct product URL
- ✅ Add product to cart and update badge
- ✅ Replace add-to-cart button with quantity selector
- ✅ Increase quantity via + button
- ✅ Decrease quantity to zero and restore button
- ✅ Toast notification when adding to cart
- ✅ Favorites toggle (add/remove) and badge update
- ✅ Toast when adding to favorites
- ✅ Navigate to product page from shop
- ✅ Breadcrumbs or back navigation
- ✅ Related products section
- ✅ Direct URL navigation via ROUTES constant

### Auth Tests (11 tests)

- ✅ Open sign-in modal when clicking auth button
- ✅ Close modal when clicking backdrop
- ✅ Show error with invalid credentials
- ✅ Show error when submitting empty form
- ✅ Switch between email and phone tabs
- ✅ Sign in with valid credentials
- ✅ Persist session after page reload
- ✅ Sign out successfully
- ✅ Redirect to home after sign out
- ✅ Open sign-up form from sign-in modal
- ✅ Navigate back to sign-in from sign-up form
- ✅ Show all required sign-up fields
- ✅ Access profile page when authenticated
- ✅ Access orders page when authenticated

### Cart Tests (8 tests)

- ✅ Add product to cart
- ✅ Increase quantity
- ✅ Decrease quantity
- ✅ Remove product
- ✅ Empty cart state
- ✅ Cart persistence
- ✅ Cart total updates
- ✅ Navigate to checkout

### Checkout Tests (9 tests)

- ✅ Complete checkout with valid data
- ✅ Form validation
- ✅ Fill form fields
- ✅ Email validation
- ✅ Phone validation
- ✅ Order summary display
- ✅ Order creation and redirect
- ✅ Cart cleared after checkout
- ✅ Multiple items checkout

### Favorites Tests (5 tests)

- ✅ Add to favorites
- ✅ Remove from favorites
- ✅ View favorites page
- ✅ Favorites persistence
- ✅ Add favorite to cart

## Troubleshooting

### Tests failing locally

1. Ensure dev server is running: `npm run dev`
2. Check if port 3000 is available
3. Clear browser cache: `npx playwright clean`
4. Reinstall browsers: `npx playwright install`

### Timeout errors

Increase timeout in `playwright.config.ts` or specific test:

```typescript
test('slow test', async ({ page }) => {
  test.setTimeout(60000); // 60 seconds
  // ... test code
});
```

### Element not found

1. Check if `data-testid` attributes exist in components
2. Update selectors in `test-data.ts`
3. Use Playwright Inspector to debug: `npm run test:e2e:debug`

## CI/CD Integration

Tests are configured to run on CI with:

- Automatic retries (2 attempts)
- Video recording on failure
- Screenshot on failure
- JSON reporter for results parsing

Example GitHub Actions workflow:

```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '22'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run build
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Best Practices

1. **Keep tests focused**: Each test should verify one specific behavior
2. **Use descriptive test names**: "should add product to cart" is better than "cart test 1"
3. **Clean up after tests**: Remove test data in `afterEach` hooks
4. **Handle flakiness**: Use proper waiting strategies, avoid hardcoded waits
5. **Run tests before committing**: Ensure your changes don't break existing tests
6. **Update tests with features**: When adding new features, add corresponding tests

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
