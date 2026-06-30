/**
 * Test data fixtures for E2E tests
 */

/**
 * Routes used in tests
 */
export const ROUTES = {
  home: '/en',
  shop: '/en/shop',
  cart: '/en/cart',
  checkout: '/en/checkout',
  payment: '/en/payment',
  favorites: '/en/favorites',
  orders: '/en/orders',
  profile: '/en/profile',
  product: '/en/shop/product/65',
} as const;

/**
 * Payment-flow fixtures.
 *
 * The E2E suite asserts the app's own responsibility: confirming a Stripe order
 * creates the order and hands off to hosted Stripe Checkout (`checkout.stripe.com`).
 *
 * Completing the payment ON Stripe and the subsequent redirect are intentionally
 * NOT automated — the card inputs live in cross-origin Stripe iframes and the
 * `success_url` is configured on the OneEntry payment account (currently the
 * hosted demo `oneentry-nextjs-e-commerce-demo.vercel.app`, so the browser
 * leaves `localhost`). See the note in payment-flow.spec.ts.
 */
export const PAYMENT = {
  /** Hosted Stripe Checkout host the app redirects to for online gateways. */
  stripeCheckoutHost: 'checkout.stripe.com',
  /** Order-storage createOrder endpoint (POST) — used for network assertions. */
  createOrderUrlPart: '/orders-storage/marker/order/orders',
  /** Delivery address used to ensure the order has non-empty formData. */
  deliveryAddress: 'Test street 1',
} as const;

/**
 * Test user data for checkout
 */
export const TEST_USER = {
  name: 'Test User',
  email: 'yout@mail.com',
  phone: '+1234567890',
  address: '123 Test Street',
  city: 'Test City',
  zip: '12345',
  country: 'Test Country',
} as const;

/**
 * Test auth user credentials
 * Set TEST_USER_EMAIL and TEST_USER_PASSWORD env vars to override
 */
export const TEST_AUTH_USER = {
  email: process.env.TEST_USER_EMAIL || 'test@example.com',
  password: process.env.TEST_USER_PASSWORD || 'TestPassword123!',
} as const;

/**
 * Test product selectors
 * These should be updated if the product structure changes
 *
 * Selector types supported by Playwright:
 * - data-testid: '[data-testid="element"]' (recommended)
 * - CSS class: '.my-class'
 * - CSS ID: '#my-id'
 * - Attribute: '[aria-label="My Label"]'
 * - Text: 'text=Button Text'
 * - Role: 'role=button[name="Submit"]'
 */
export const SELECTORS = {
  // Product page
  addToCartButton: '[data-testid="add-to-cart-button"]',
  addToFavoritesButton: '[data-testid="add-to-favorites-button"]',
  productPrice: '[data-testid="product-price"]',
  productTitle: '[data-testid="product-title"]',
  cartBadge: '[data-testid="cart-badge"]',

  // Cart (clicking cart icon navigates to /cart page)
  cartIcon: '[data-testid="cart-icon"]',
  // Cart page content wrapper
  cartDrawer: '[data-testid="cart-drawer"]',
  cartItem: '[data-testid="cart-item"]',
  cartItemQuantity: '[data-testid="cart-item-quantity"]',
  cartItemRemove: '[data-testid="cart-item-remove"]',
  cartTotal: '[data-testid="cart-total"]',
  checkoutButton: '[data-testid="checkout-button"]',
  increaseQuantityButton: '[data-testid="increase-quantity"]',
  decreaseQuantityButton: '[data-testid="decrease-quantity"]',

  // Favorites
  favoritesIcon: '[data-testid="favorites-icon"]',
  favoritesDrawer: '[data-testid="favorites-drawer"]',
  productCard: '.product-card',

  // !!! Success/Error
  successMessage: '[data-testid="success-message"]',
  errorMessage: '[data-testid="error-message"]',

  // Auth
  authButton: '[data-testid="auth-button"]',
  userMenuButton: '[data-testid="user-menu-button"]',
  logoutButton: '[data-testid="logout-button"]',
  signInModal: '#modalBody',
  emailInput: '#email_reg',
  passwordInput: '#password_reg',
  nameInput: '#name_reg',
  phoneInput: '#phone_reg',
  modalSubmitButton: '#modalBody button[type="submit"]',
  modalError: '#modalBody .text-red-500',

  // Search
  searchInput: '#quick-search',
  searchSubmitButton: '[aria-label="Submit search"]',
  searchResults: '#search-results',
  searchResultLink: '#search-results a',
  closeSearchResults: '[aria-label="Close search results"]',

  // Catalog / Filters
  filterButton: '[aria-label="Filter"]',
  filterModal: '#modalBody',
  filterApplyButton: '[data-testid="filter-apply-button"]',
  filterResetButton: '[data-testid="filter-reset-button"]',
  priceFromInput: '[data-testid="price-from-input"]',
  priceToInput: '[data-testid="price-to-input"]',

  // Checkout
  checkoutForm: '[data-testid="checkout-form"]',
  checkoutSubmitButton: '[data-testid="place-order-button"]',
  checkoutOrderSummary: '[data-testid="order-summary"]',
  checkoutDatePicker: '[data-testid="date-picker"]',
  checkoutTimeSlot: '[data-testid="time-slot"]',
  checkoutPaymentSection: '[data-testid="payment-section"]',

  // Navigation
  langSelector: 'select[name="lang-selector"]',
  menuButton: '[aria-label="Open menu"]',
} as const;
