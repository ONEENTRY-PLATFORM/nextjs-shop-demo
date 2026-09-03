import { beforeEach, describe, expect, it } from '@jest/globals';
import { act, renderHook, waitFor } from '@testing-library/react';

import { useCreateOrder } from '@/app/api/hooks/useCreateOrder';

/*
 * Unit tests for useCreateOrder — the core of the payment flow.
 *
 * They lock in the two fixes made after Stripe orders stopped redirecting to
 * payment:
 *  1. the online-vs-offline decision is taken from the gateway the user
 *     selected (Redux order.paymentAccountIdentifier), not from the
 *     paymentAccountIdentifier echoed back by createOrder (which is not
 *     reliably populated and silently routed every Stripe order to /orders);
 *  2. a failed createOrder is detected with isError and surfaced instead of
 *     clearing the cart and navigating away.
 */

const mockPush = jest.fn();
const mockDispatch = jest.fn();
const mockCreateOrder = jest.fn();
const mockCreateSession = jest.fn();
const mockGetSessionByOrderId = jest.fn();

// Holds the Redux `order` returned to the hook via useAppSelector; set per test.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let mockOrder: any;

jest.mock('next-transition-router', () => ({
  useTransitionRouter: () => ({ push: mockPush }),
}));

/*
  Mocks the SDK module directly rather than the old `@/app/api` barrel: the
  barrel was removed because it dragged every server wrapper into client chunks,
  and `useCreateOrder` now imports `getApi` / `isError` from their real module.
*/
jest.mock('@/app/api/api/api', () => ({
  getApi: () => ({
    Orders: { createOrder: mockCreateOrder },
    Payments: {
      createSession: mockCreateSession,
      getSessionByOrderId: mockGetSessionByOrderId,
    },
  }),
  // Mirror the real type guard's runtime behaviour.
  isError: (result: unknown) =>
    typeof result === 'object' &&
    result !== null &&
    'statusCode' in result &&
    'message' in result,
}));

jest.mock('@/app/store/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: (state: unknown) => unknown) =>
    selector({ orderReducer: { order: mockOrder } }),
}));

jest.mock('@/app/store/reducers/CartSlice', () => ({
  removeProduct: (id: number) => ({ type: 'cart/removeProduct', payload: id }),
}));

jest.mock('@/app/store/reducers/OrderSlice', () => ({
  removeOrder: () => ({ type: 'order/removeOrder' }),
}));

jest.mock('@/app/utils/errorHandler', () => ({
  handleApiError: (_context: string, error: unknown) => ({
    message: error instanceof Error ? error.message : String(error),
  }),
}));

const STRIPE_URL = 'https://checkout.stripe.com/c/pay/cs_test_123';

/**
 * Builds a valid Redux order fixture for the given gateway identifier.
 * @param   {string} paymentAccountIdentifier - Selected payment gateway marker.
 * @returns {object}                          Order shape consumed by the hook.
 */
const makeOrder = (paymentAccountIdentifier: string) => ({
  formIdentifier: 'order',
  paymentAccountIdentifier,
  formData: [{ marker: 'order_address', type: 'string', value: 'test' }],
  products: [{ productId: 1, quantity: 1, selected: true }],
});

const removeOrderAction = { type: 'order/removeOrder' };

beforeEach(() => {
  jest.clearAllMocks();
  mockGetSessionByOrderId.mockResolvedValue([]); // no pre-existing session
});

describe('useCreateOrder › onConfirmOrder', () => {
  it('creates a session and redirects to the Stripe payment URL for an online gateway', async () => {
    mockOrder = makeOrder('stripe');
    mockCreateOrder.mockResolvedValue({
      id: 472,
      paymentAccountIdentifier: 'stripe',
    });
    mockCreateSession.mockResolvedValue({ paymentUrl: STRIPE_URL });

    const { result } = renderHook(() => useCreateOrder({ langCode: 'en_US' }));

    await act(async () => {
      await result.current.onConfirmOrder();
    });

    expect(mockCreateOrder).toHaveBeenCalledTimes(1);
    expect(mockCreateSession).toHaveBeenCalledWith(472, 'session');
    expect(mockPush).toHaveBeenCalledWith(STRIPE_URL);
    expect(mockPush).not.toHaveBeenCalledWith('/orders');
    expect(mockDispatch).toHaveBeenCalledWith(removeOrderAction);
    expect(result.current.error).toBe('');
  });

  it('redirects to /orders for an offline gateway (cash) without creating a session', async () => {
    mockOrder = makeOrder('cash');
    mockCreateOrder.mockResolvedValue({
      id: 99,
      paymentAccountIdentifier: 'cash',
    });

    const { result } = renderHook(() => useCreateOrder({ langCode: 'en_US' }));

    await act(async () => {
      await result.current.onConfirmOrder();
    });

    expect(mockPush).toHaveBeenCalledWith('/orders');
    expect(mockCreateSession).not.toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith(removeOrderAction);
  });

  it('regression: still redirects to Stripe when createOrder omits paymentAccountIdentifier', async () => {
    // The bug: gating on the response field (here absent) sent Stripe orders to
    // /orders. The fix gates on the user-selected gateway from Redux instead.
    mockOrder = makeOrder('stripe');
    mockCreateOrder.mockResolvedValue({ id: 5 }); // no paymentAccountIdentifier
    mockCreateSession.mockResolvedValue({ paymentUrl: STRIPE_URL });

    const { result } = renderHook(() => useCreateOrder({ langCode: 'en_US' }));

    await act(async () => {
      await result.current.onConfirmOrder();
    });

    expect(mockCreateSession).toHaveBeenCalledWith(5, 'session');
    expect(mockPush).toHaveBeenCalledWith(STRIPE_URL);
    expect(mockPush).not.toHaveBeenCalledWith('/orders');
  });

  it('surfaces a failed createOrder and keeps the cart/order intact', async () => {
    mockOrder = makeOrder('stripe');
    mockCreateOrder.mockResolvedValue({
      statusCode: 400,
      message: 'empty form data section',
    });

    const { result } = renderHook(() => useCreateOrder({ langCode: 'en_US' }));

    await act(async () => {
      await result.current.onConfirmOrder();
    });

    await waitFor(() =>
      expect(result.current.error).toBe('empty form data section'),
    );
    expect(mockCreateSession).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalledWith(removeOrderAction);
  });

  it('asks the user to pick a payment method when none is selected', async () => {
    mockOrder = makeOrder(''); // no gateway selected

    const { result } = renderHook(() => useCreateOrder({ langCode: 'en_US' }));

    await act(async () => {
      await result.current.onConfirmOrder();
    });

    await waitFor(() =>
      expect(result.current.error).toBe('Please select a payment method'),
    );
    expect(mockCreateOrder).not.toHaveBeenCalled();
  });
});

describe('useCreateOrder › createSession', () => {
  it('reuses an existing session paymentUrl instead of creating a duplicate', async () => {
    mockOrder = makeOrder('stripe');
    mockGetSessionByOrderId.mockResolvedValue([
      { paymentUrl: 'https://checkout.stripe.com/existing' },
    ]);

    const { result } = renderHook(() => useCreateOrder({ langCode: 'en_US' }));

    let status = '';
    await act(async () => {
      status = await result.current.createSession(472);
    });

    expect(status).toBe('payment_method');
    expect(mockPush).toHaveBeenCalledWith(
      'https://checkout.stripe.com/existing',
    );
    expect(mockCreateSession).not.toHaveBeenCalled();
  });

  it('returns an error status when no order id is provided', async () => {
    mockOrder = makeOrder('stripe');

    const { result } = renderHook(() => useCreateOrder({ langCode: 'en_US' }));

    let status = '';
    await act(async () => {
      status = await result.current.createSession(0);
    });

    expect(status).toBe('error');
    expect(mockGetSessionByOrderId).not.toHaveBeenCalled();
    expect(mockCreateSession).not.toHaveBeenCalled();
  });
});
