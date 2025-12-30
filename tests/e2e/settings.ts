/**
 * Test data fixtures for E2E tests
 */

/**
 * Test user data for checkout
 */
export const TEST_USER = {
  name: 'Test User',
  email: 'kvasssukr.net@gmail.com',
  phone: '+1234567890',
  address: '123 Test Street',
  city: 'Test City',
  zip: '12345',
  country: 'Test Country',
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
} as const;

/**
 * Routes used in tests
 */
export const ROUTES = {
  home: '/en',
  shop: '/en/shop',
  cart: '/en/cart',
  favorites: '/en/favorites',
  orders: '/en/orders',
  product: '/en/shop/product/65',
} as const;
