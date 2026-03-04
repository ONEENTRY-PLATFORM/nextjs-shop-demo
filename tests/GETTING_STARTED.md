# Getting Started with E2E Testing

This guide will help you start using the E2E tests that have been set up for this project.

## ✅ What's Been Set Up

The following has been configured and ready to use:

1. **Playwright** - E2E testing framework installed
2. **Test Structure** - Organized test files and helpers
3. **Test Scripts** - npm commands for running tests
4. **22 E2E Tests** - Covering critical user flows:
   - Cart functionality (8 tests)
   - Checkout process (9 tests)
   - Favorites/wishlist (5 tests)

## 📁 Project Structure

```TEXT
tests/
├── e2e/
│   ├── fixtures/
│   │   └── test-data.ts         # Test data and selectors
│   ├── helpers/
│   │   ├── cart-helpers.ts      # Cart operations
│   │   ├── checkout-helpers.ts  # Checkout operations
│   │   └── navigation-helpers.ts # Navigation utilities
│   ├── cart.spec.ts             # Cart tests
│   ├── checkout.spec.ts         # Checkout tests
│   └── favorites.spec.ts        # Favorites tests
├── GETTING_STARTED.md           # This file
├── INTEGRATION_GUIDE.md         # How to add data-testid
└── README.md                     # Detailed documentation
```

## 🚀 Quick Start

### 1. Install Remaining Browsers (Optional)

You can install additional browsers if needed:

```bash
# Install all browsers
npx playwright install

# Or install specific browsers
npx playwright install firefox
npx playwright install webkit
```

### 2. Run Your First Test

Start the development server in one terminal:

```bash
npm run dev
```

In another terminal, run the tests:

```bash
# Run all tests in UI mode (recommended for first time)
npm run test:e2e:ui
```

This will open the Playwright UI where you can:

- See all available tests
- Run tests individually
- Watch tests execute in real-time
- Debug failures

## 📋 Next Steps

### Step 1: Add data-testid Attributes

The tests are currently set up but will fail because the components don't have the required `data-testid` attributes yet.

**Follow the [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)** to add these attributes to your components.

**Priority order:**

1. Cart components (cart icon, drawer, items)
2. Product components (add to cart button)
3. Checkout form (form inputs, submit button)
4. Favorites components (optional)

### Step 2: Run Tests Incrementally

As you add `data-testid` attributes, run specific tests to verify:

```bash
# Run only cart tests
npx playwright test cart.spec.ts --headed

# Run only checkout tests
npx playwright test checkout.spec.ts --headed

# Run a specific test
npx playwright test -g "should add product to cart"
```

### Step 3: Debug Failing Tests

If tests fail, use the debug mode:

```bash
npm run test:e2e:debug
```

This opens Playwright Inspector where you can:

- Step through tests
- Inspect the page at each step
- See what selectors are being used
- Identify missing elements

## 🎯 Common Commands

```bash
# Development
npm run test:e2e:ui          # Run tests in UI mode (best for development)
npm run test:e2e:headed      # Run tests with visible browser
npm run test:e2e:debug       # Debug tests with Inspector

# CI/Production
npm run test:e2e             # Run all tests headless
npm run test:e2e:chromium    # Run only on Chrome
npm run test:e2e:firefox     # Run only on Firefox

# Reporting
npm run test:e2e:report      # View last test report
```

## 🔍 Understanding Test Results

### Passing Tests ✅

When tests pass, you'll see:

```text
✓ tests/e2e/cart.spec.ts:10:5 › should add product to cart (5s)
```

### Failing Tests ❌

When tests fail, you'll see:

```text
✗ tests/e2e/cart.spec.ts:10:5 › should add product to cart (5s)

Error: locator.click: Timeout 30000ms exceeded.
Locator: [data-testid="add-to-cart-button"]
```

This means the element with `data-testid="add-to-cart-button"` was not found.

**Solution**: Add the `data-testid` attribute to that component.

## 🎨 Visual Debugging

Playwright captures screenshots and videos on failure:

```text
test-results/
├── cart-should-add-product-to-cart/
│   ├── test-failed-1.png      # Screenshot at failure
│   └── video.webm              # Video of test execution
```

View these to see exactly what happened when the test failed.

## 📝 Example: Adding Your First data-testid

Let's add a `data-testid` to the "Add to Cart" button:

### Before

```tsx
<button onClick={handleAddToCart}>
  Add to Cart
</button>
```

### After

```tsx
<button
  data-testid="add-to-cart-button"
  onClick={handleAddToCart}
>
  Add to Cart
</button>
```

Now the test can find this button and click it!

## 🧪 Test Coverage

Current test coverage:

### Cart Tests (8)

- ✅ Add product to cart
- ✅ Increase/decrease quantity
- ✅ Remove product
- ✅ Empty cart state
- ✅ Cart persistence
- ✅ Total calculation
- ✅ Navigate to checkout

### Checkout Tests (9)

- ✅ Complete checkout flow
- ✅ Form validation
- ✅ Email/phone validation
- ✅ Order creation
- ✅ Success redirect
- ✅ Multiple items

### Favorites Tests (5)

- ✅ Add/remove favorites
- ✅ View favorites page
- ✅ Favorites persistence
- ✅ Add favorite to cart

## 🐛 Troubleshooting

### Problem: Tests timeout

**Solution**:

- Ensure dev server is running (`npm run dev`)
- Check if port 3000 is available
- Increase timeout in test if needed

### Problem: Element not found

**Solution**:

- Add `data-testid` attribute to component
- Check selector in `tests/e2e/fixtures/test-data.ts`
- Use Playwright Inspector to debug

### Problem: Tests are flaky

**Solution**:

- Avoid hardcoded waits (`page.waitForTimeout()`)
- Use Playwright's auto-waiting
- Add proper loading states in components

## 📚 Additional Resources

- **[README.md](./README.md)** - Detailed test documentation
- **[INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)** - How to add data-testid
- **[Playwright Docs](https://playwright.dev/)** - Official documentation
- **[Best Practices](https://playwright.dev/docs/best-practices)** - Playwright best practices

## 🎉 Success Criteria

You'll know the tests are working when:

1. ✅ All tests pass in UI mode
2. ✅ Tests pass in headless mode (`npm run test:e2e`)
3. ✅ Screenshots show actual interactions
4. ✅ Tests are stable (not flaky)

## 🔄 Continuous Integration

Once tests are passing locally, add them to your CI pipeline:

```yaml
# .github/workflows/e2e.yml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run build
      - run: npm run test:e2e
```

## 📞 Need Help?

1. Check the error message carefully
2. Use Playwright Inspector: `npm run test:e2e:debug`
3. Review the [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)
4. Check Playwright documentation

## ✨ What's Next?

1. **Add data-testid attributes** following the integration guide
2. **Run tests** to verify implementation
3. **Add more tests** as you build new features
4. **Set up CI** to run tests automatically

Happy Testing! 🚀
