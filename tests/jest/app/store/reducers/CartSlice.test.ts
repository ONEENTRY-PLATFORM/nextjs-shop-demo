/*
 * Unit tests for the cart slice reducers.
 *
 * Ported from the nextjs-restaurant project and adapted to this project's
 * semantics, which differ deliberately:
 *  - a repeated `addProductToCart` MERGES by summing quantities (restaurant: no-op);
 *  - `decreaseProductQty` REMOVES the entry at quantity <= 0 (restaurant: clamps to 1);
 *  - `units` is always a hard upper cap for increase/set (restaurant: 0 = "no bound").
 *    The `units: 0` case (clamps the quantity to 0) is intentionally not
 *    asserted here — callers always pass the real `units_product` value.
 */
import { describe, expect, it } from '@jest/globals';

import cartReducer, {
  addProductToCart,
  decreaseProductQty,
  increaseProductQty,
  removeAllProducts,
  removeProduct,
  setProductQty,
} from '@/app/store/reducers/CartSlice';

/**
 * Build a fresh `cartSlice` state.
 *
 * Letting the reducer initialise the full state (via `@@INIT`) keeps tests
 * resilient to slice growth — adding a new field to `InitialStateType` does
 * not break existing tests.
 * @returns {ReturnType<typeof cartReducer>} Initial cart-slice state.
 */
const initial = () => cartReducer(undefined, { type: '@@INIT' });

describe('CartSlice — addProductToCart', () => {
  it('adds a new product when the id is not in the cart', () => {
    const state = cartReducer(
      initial(),
      addProductToCart({ id: 1, quantity: 2, selected: true }),
    );
    expect(state.productsData).toEqual([
      { id: 1, quantity: 2, selected: true },
    ]);
  });

  it('merges a repeated add by summing the quantities', () => {
    let state = cartReducer(
      initial(),
      addProductToCart({ id: 1, quantity: 2, selected: true }),
    );
    state = cartReducer(
      state,
      addProductToCart({ id: 1, quantity: 5, selected: true }),
    );
    expect(state.productsData).toHaveLength(1);
    expect(state.productsData[0]?.quantity).toBe(7);
  });

  it('clamps a new entry to a minimum quantity of 1', () => {
    const state = cartReducer(
      initial(),
      addProductToCart({ id: 1, quantity: 0, selected: true }),
    );
    expect(state.productsData[0]?.quantity).toBe(1);
  });
});

describe('CartSlice — increaseProductQty', () => {
  it('adds payload.quantity to the existing entry (within units)', () => {
    let state = cartReducer(
      initial(),
      addProductToCart({ id: 1, quantity: 1, selected: true }),
    );
    state = cartReducer(
      state,
      increaseProductQty({ id: 1, quantity: 2, units: 99 }),
    );
    expect(state.productsData[0]?.quantity).toBe(3);
  });

  it('caps the result at `units`', () => {
    let state = cartReducer(
      initial(),
      addProductToCart({ id: 1, quantity: 4, selected: true }),
    );
    state = cartReducer(
      state,
      increaseProductQty({ id: 1, quantity: 10, units: 5 }),
    );
    expect(state.productsData[0]?.quantity).toBe(5);
  });

  it('adds the product with quantity 1 when the id is not in the cart', () => {
    const state = cartReducer(
      initial(),
      increaseProductQty({ id: 999, quantity: 5, units: 99 }),
    );
    expect(state.productsData).toEqual([
      { id: 999, quantity: 1, selected: true },
    ]);
  });
});

describe('CartSlice — decreaseProductQty', () => {
  it('subtracts payload.quantity from the existing entry', () => {
    let state = cartReducer(
      initial(),
      addProductToCart({ id: 1, quantity: 5, selected: true }),
    );
    state = cartReducer(state, decreaseProductQty({ id: 1, quantity: 2 }));
    expect(state.productsData[0]?.quantity).toBe(3);
  });

  it('removes the entry when the quantity drops to 0 or below', () => {
    let state = cartReducer(
      initial(),
      addProductToCart({ id: 1, quantity: 1, selected: true }),
    );
    state = cartReducer(state, decreaseProductQty({ id: 1, quantity: 5 }));
    expect(state.productsData).toHaveLength(0);
  });

  it('is a noop when the id is not in the cart', () => {
    const state = cartReducer(
      initial(),
      decreaseProductQty({ id: 999, quantity: 1 }),
    );
    expect(state.productsData).toHaveLength(0);
  });
});

describe('CartSlice — setProductQty', () => {
  it('sets the quantity directly (within units)', () => {
    let state = cartReducer(
      initial(),
      addProductToCart({ id: 1, quantity: 1, selected: true }),
    );
    state = cartReducer(
      state,
      setProductQty({ id: 1, quantity: 7, units: 99 }),
    );
    expect(state.productsData[0]?.quantity).toBe(7);
  });

  it('caps at `units` when set', () => {
    let state = cartReducer(
      initial(),
      addProductToCart({ id: 1, quantity: 1, selected: true }),
    );
    state = cartReducer(
      state,
      setProductQty({ id: 1, quantity: 99, units: 10 }),
    );
    expect(state.productsData[0]?.quantity).toBe(10);
  });

  it('removes the entry when quantity <= 0 (prevents the empty-slot UI freeze)', () => {
    let state = cartReducer(
      initial(),
      addProductToCart({ id: 1, quantity: 3, selected: true }),
    );
    state = cartReducer(
      state,
      setProductQty({ id: 1, quantity: 0, units: 10 }),
    );
    expect(state.productsData).toHaveLength(0);
  });
});

describe('CartSlice — removeProduct / removeAllProducts', () => {
  it('removeProduct deletes by id', () => {
    let state = cartReducer(
      initial(),
      addProductToCart({ id: 1, quantity: 1, selected: true }),
    );
    state = cartReducer(
      state,
      addProductToCart({ id: 2, quantity: 1, selected: true }),
    );
    state = cartReducer(state, removeProduct(1));
    expect(state.productsData.map((p) => p.id)).toEqual([2]);
  });

  it('removeAllProducts empties productsData', () => {
    let state = cartReducer(
      initial(),
      addProductToCart({ id: 1, quantity: 1, selected: true }),
    );
    state = cartReducer(
      state,
      addProductToCart({ id: 2, quantity: 1, selected: true }),
    );
    state = cartReducer(state, removeAllProducts());
    expect(state.productsData).toEqual([]);
  });
});
