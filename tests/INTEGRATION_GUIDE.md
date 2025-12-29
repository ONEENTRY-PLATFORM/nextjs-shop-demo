# Integration Guide: Adding data-testid Attributes

This guide explains how to add `data-testid` attributes to your components to make them testable with E2E tests.

## Why data-testid?

Using `data-testid` attributes provides:

- **Stability**: Tests won't break when CSS classes or text content changes
- **Clarity**: Clear indication of what elements are used in tests
- **Separation**: Test selectors separate from styling and content

## Where to Add data-testid

Add `data-testid` to:

1. Interactive elements (buttons, links, inputs)
2. Dynamic content (cart items, product cards, totals)
3. Navigation elements (menus, drawers, modals)
4. Form elements (inputs, selects, checkboxes)
5. Status indicators (badges, counters, messages)

## Best Practices

### 1. Use Descriptive Names

```tsx
// Good
<button data-testid="add-to-cart-button">Add to Cart</button>

// Bad
<button data-testid="btn1">Add to Cart</button>
```

### 2. Be Consistent

Use the same naming pattern across components:

- Actions: `{action}-{element}` (e.g., `add-to-cart-button`, `submit-order-button`)
- Content: `{content}-{type}` (e.g., `product-title`, `cart-total`)
- Containers: `{feature}-{container}` (e.g., `cart-drawer`, `checkout-form`)

### 3. Don't Overuse

Only add `data-testid` to elements that need to be tested. Don't add it to every element.

```tsx
// Good - Only test-relevant elements
<div className="product-card">
  <h3>{product.title}</h3>
  <button data-testid="add-to-cart-button">Add to Cart</button>
</div>

// Bad - Too many test IDs
<div data-testid="product-card" className="product-card">
  <h3 data-testid="product-card-title">{product.title}</h3>
  <div data-testid="product-card-actions">
    <button data-testid="add-to-cart-button">Add to Cart</button>
  </div>
</div>
```

### 4. Dynamic Lists

For dynamic lists, use the same `data-testid` for all items:

```tsx
// Good - Same testid for all items
{items.map(item => (
  <div key={item.id} data-testid="cart-item">
    {/* Item content */}
  </div>
))}

// Tests can select: page.locator('[data-testid="cart-item"]').nth(0)
```

### 5. Conditional Elements

Add test IDs to elements that appear conditionally:

```tsx
{isLoading ? (
  <div data-testid="loading-spinner">Loading...</div>
) : (
  <div data-testid="content">
    {/* Content */}
  </div>
)}
```

## Implementation Checklist

Use this checklist to track implementation progress:

- [ ] Cart icon with badge
- [ ] Cart drawer
- [ ] Cart items with quantity controls
- [ ] Cart total
- [ ] Checkout button
- [ ] Add to cart button
- [ ] Product title and price
- [ ] Favorites icon with badge
- [ ] Add to favorites button
- [ ] Favorites drawer
- [ ] Favorite items
- [ ] Checkout form inputs
- [ ] Submit order button
- [ ] Success/error messages

## Testing Your Changes

After adding `data-testid` attributes:

1. **Run the dev server**:

   ```bash
   npm run dev
   ```

2. **Run E2E tests**:

   ```bash
   npm run test:e2e:headed
   ```

3. **Use Playwright Inspector** to debug:

   ```bash
   npm run test:e2e:debug
   ```

4. **Check specific selector**:
   Open browser console and run:

   ```javascript
   document.querySelector('[data-testid="add-to-cart-button"]')
   ```

## Examples from Real Components

Here are examples based on your project structure:

### ProductCard Component

```tsx
// components/layout/products-grid/components/product-card/ProductCard.tsx
export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="product-card">
      <h3 data-testid="product-title">{product.title}</h3>
      <span data-testid="product-price">${product.price}</span>
      <button
        data-testid="add-to-cart-button"
        onClick={handleAddToCart}
      >
        Add to Cart
      </button>
      <button
        data-testid="add-to-favorites-button"
        onClick={handleAddToFavorites}
      >
        ♥
      </button>
    </div>
  );
}
```

### Header Component

```tsx
// components/layout/header/Header.tsx
export default function Header() {
  return (
    <header>
      <nav>
        {/* Other nav items */}
        <button data-testid="favorites-icon" onClick={openFavorites}>
          <HeartIcon />
          {favoritesCount > 0 && (
            <span data-testid="favorites-badge">{favoritesCount}</span>
          )}
        </button>
        <button data-testid="cart-icon" onClick={openCart}>
          <CartIcon />
          {cartCount > 0 && (
            <span data-testid="cart-badge">{cartCount}</span>
          )}
        </button>
      </nav>
    </header>
  );
}
```

## Need Help?

If you're unsure where to add a `data-testid`, check:

1. The test files in `tests/e2e/` to see what selectors are being used
2. The `SELECTORS` object in `tests/e2e/fixtures/test-data.ts`
3. Run tests and see which selectors are failing

## Next Steps

1. Start with high-priority components (cart, checkout)
2. Add `data-testid` attributes incrementally
3. Run tests after each change
4. Update `test-data.ts` if you change selector names
5. Document any custom selectors you add
