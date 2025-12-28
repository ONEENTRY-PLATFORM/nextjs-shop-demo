/**
 * Test data fixtures for E2E tests
 */

/**
 * Test user data for checkout
 */
export const TEST_USER = {
  name: 'Test User',
  email: 'test@example.com',
  phone: '+1234567890',
  address: '123 Test Street',
  city: 'Test City',
  zip: '12345',
  country: 'Test Country',
} as const;

/**
 * Test product selectors
 * These should be updated if the product structure changes
 */
export const SELECTORS = {
  // Product page
  addToCartButton: '[data-testid="add-to-cart-button"]',
  addToFavoritesButton: '[data-testid="add-to-favorites-button"]',
  productPrice: '[data-testid="product-price"]',
  productTitle: '[data-testid="product-title"]',

  // Cart
  cartIcon: '[data-testid="cart-icon"]',
  cartDrawer: '[data-testid="cart-drawer"]',
  cartItem: '[data-testid="cart-item"]',
  cartItemQuantity: '[data-testid="cart-item-quantity"]',
  cartItemRemove: '[data-testid="cart-item-remove"]',
  cartTotal: '[data-testid="cart-total"]',
  checkoutButton: '[data-testid="checkout-button"]',
  increaseQuantityButton: '[data-testid="increase-quantity"]',
  decreaseQuantityButton: '[data-testid="decrease-quantity"]',

  // Checkout form
  checkoutForm: '[data-testid="checkout-form"]',
  nameInput: '[data-testid="name-input"]',
  emailInput: '[data-testid="email-input"]',
  phoneInput: '[data-testid="phone-input"]',
  addressInput: '[data-testid="address-input"]',
  submitOrderButton: '[data-testid="submit-order-button"]',

  // Success/Error
  successMessage: '[data-testid="success-message"]',
  errorMessage: '[data-testid="error-message"]',

  // Favorites
  favoritesIcon: '[data-testid="favorites-icon"]',
  favoritesDrawer: '[data-testid="favorites-drawer"]',
  favoriteItem: '[data-testid="favorite-item"]',
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
} as const;
