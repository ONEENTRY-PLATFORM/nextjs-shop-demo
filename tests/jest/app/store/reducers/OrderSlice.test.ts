/*
 * Unit tests for the order slice reducers.
 *
 * Ported from the nextjs-restaurant project and trimmed to the actions this
 * slice actually has (no checkout step machine, coupons or storage resolution
 * here — the storage/form marker is supplied by `useCreateOrder`, see
 * mismatch-log C.7.1).
 */
import { describe, expect, it } from '@jest/globals';

import type { IAppOrder } from '@/app/store/reducers/OrderSlice';
import orderReducer, {
  addData,
  addOrderCurrency,
  addPaymentMethod,
  addProducts,
  createOrder,
  removeOrder,
} from '@/app/store/reducers/OrderSlice';

/**
 * Build a fresh `order` slice state via the reducer's own initialiser.
 * @returns {ReturnType<typeof orderReducer>} Initial order-slice state.
 */
const initial = () => orderReducer(undefined, { type: '@@INIT' });

const emptyOrder: IAppOrder = {
  formData: [],
  products: [],
};

describe('OrderSlice — order draft', () => {
  // `create` spreads the payload UNDER the existing draft
  // (`{...payload, ...state.order}`), so fields already present in the draft
  // win, while fields the draft lacks are taken from the payload.
  it('createOrder fills fields the draft lacks (formIdentifier)', () => {
    let state = initial();
    expect(state.order.formIdentifier).toBeUndefined();
    state = orderReducer(
      state,
      createOrder({ ...emptyOrder, formIdentifier: 'A' }),
    );
    expect(state.order.formIdentifier).toBe('A');
  });

  it('createOrder does not overwrite fields the draft already has', () => {
    let state = orderReducer(
      initial(),
      createOrder({ ...emptyOrder, formIdentifier: 'A' }),
    );
    state = orderReducer(
      state,
      createOrder({ ...emptyOrder, formIdentifier: 'B' }),
    );
    expect(state.order.formIdentifier).toBe('A');
  });

  it('removeOrder resets the draft to empty formData/products', () => {
    let state = orderReducer(
      initial(),
      addData({ marker: 'name', type: 'string', value: 'Alex' } as never),
    );
    state = orderReducer(
      state,
      createOrder({ ...emptyOrder, formIdentifier: 'A' }),
    );
    state = orderReducer(state, removeOrder());
    expect(state.order.formData).toEqual([]);
    expect(state.order.products).toEqual([]);
    expect(state.order.formIdentifier).toBeUndefined();
  });
});

describe('OrderSlice — addData', () => {
  it('appends a new field', () => {
    const state = orderReducer(
      initial(),
      addData({ marker: 'email', type: 'string', value: 'a@b.com' } as never),
    );
    expect(state.order.formData).toHaveLength(1);
  });

  it('updates the existing field with the same marker (not duplicates)', () => {
    let state = orderReducer(
      initial(),
      addData({ marker: 'email', type: 'string', value: 'a@b.com' } as never),
    );
    state = orderReducer(
      state,
      addData({ marker: 'email', type: 'string', value: 'new@b.com' } as never),
    );
    expect(state.order.formData).toHaveLength(1);
    const entry = state.order.formData[0] as { value: string };
    expect(entry.value).toBe('new@b.com');
  });
});

describe('OrderSlice — addProducts / addPaymentMethod / addOrderCurrency', () => {
  it('addProducts replaces the products array', () => {
    const state = orderReducer(
      initial(),
      addProducts([{ productId: 1, quantity: 2 } as never]),
    );
    expect(state.order.products).toEqual([{ productId: 1, quantity: 2 }]);
  });

  it('addPaymentMethod sets paymentAccountIdentifier', () => {
    const state = orderReducer(initial(), addPaymentMethod('cash'));
    expect(state.order.paymentAccountIdentifier).toBe('cash');
  });

  it('addOrderCurrency sets the currency', () => {
    const state = orderReducer(initial(), addOrderCurrency('USD'));
    expect(state.currency).toBe('USD');
  });
});
