'use client';

import { useTransitionRouter } from 'next-transition-router';
import type {
  IBaseOrdersEntity,
  IOrderProductData,
} from 'oneentry/dist/orders/ordersInterfaces';
import type { ISessionEntity } from 'oneentry/dist/payments/paymentsInterfaces';
import { useState } from 'react';

import { getApi, isError } from '@/app/api';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { removeProduct } from '@/app/store/reducers/CartSlice';
import { removeOrder } from '@/app/store/reducers/OrderSlice';
import { handleApiError } from '@/app/utils/errorHandler';

/** Whitelist of online gateways — extend when adding new ones (orders rule) */
const ONLINE_PAYMENT_IDENTIFIERS = ['stripe', 'paypal'];

/**
 * Custom hook to handle order creation and payment session
 * @param   {object} props          - useCreateOrder props
 * @param   {string} props.langCode - Language code
 * @returns {object}                useCreateOrder object with onConfirmOrder function, loading state and error state
 */
export const useCreateOrder = ({
  langCode,
}: {
  langCode: string;
}): {
  onConfirmOrder: () => Promise<void>;
  isLoading: boolean;
  error: string;
  setError: (error: string) => void;
} => {
  /** Initialize router for navigation */
  const router = useTransitionRouter();
  /** Get dispatch function for Redux actions */
  const dispatch = useAppDispatch();
  /** Get order data from Redux store */
  const order = useAppSelector((state) => state.orderReducer.order);

  /** Loading state for async operations */
  const [isLoading, setIsLoading] = useState<boolean>(false);
  /** Error state for handling API errors */
  const [error, setError] = useState<string>('');

  /**
   * Create payment session with Payments API
   * @param   {number}          id - Order id
   * @returns {Promise<string>}    Payment status
   * @see {@link https://doc.oneentry.cloud/docs/payments OneEntry CMS docs}
   */
  const createSession = async (id: number): Promise<string> => {
    /** Return error status if no order ID provided */
    if (!id) {
      return 'error';
    }
    /** Set loading state to true */
    setIsLoading(true);

    /** Handle payment session creation */
    try {
      /** Create payment session using Payments API */
      const session = await getApi().Payments.createSession(id, 'session');
      if (isError(session)) {
        setError(session.message);
        return '';
      }

      /** Stripe — synchronous flow: paymentUrl is returned immediately */
      if (order?.paymentAccountIdentifier === 'stripe') {
        if (session.paymentUrl) {
          router.push(session.paymentUrl);
          return 'payment_method';
        }
        return '';
      }

      /**
       * PayPal / other async online gateways — paymentUrl may be null on
       * creation, so poll getSessionByOrderId until the URL is ready.
       */
      if (session.paymentUrl) {
        router.push(session.paymentUrl);
        return 'payment_method';
      }

      for (let attempt = 0; attempt < 4; attempt++) {
        await new Promise((r) => setTimeout(r, 1500));
        const sessions = await getApi().Payments.getSessionByOrderId(id);
        if (isError(sessions)) {
          continue;
        }
        const polled: ISessionEntity | undefined = Array.isArray(sessions)
          ? sessions[0]
          : sessions;
        if (polled?.paymentUrl) {
          router.push(polled.paymentUrl);
          return 'payment_method';
        }
      }

      /** No payment URL became available within the polling window */
      setError('Payment link is not ready yet. Please try again later.');
      return '';
    } catch (error) {
      /** Handle API errors */
      const apiError = handleApiError('createSession', error);
      /** Set error message */
      setError(apiError.message);
      return '';
    } finally {
      /** Reset loading state */
      setIsLoading(false);
    }
  };

  /**
   * On confirm order Create order with Orders API
   * @returns {Promise<void>} Promise that resolves when order is confirmed
   */
  const onConfirmOrder = async (): Promise<void> => {
    setIsLoading(true);
    if (order?.formIdentifier && order?.paymentAccountIdentifier) {
      /** prepare order data */
      const orderFormData = order.formData
        .slice()
        .filter((element) => element.marker !== 'time')
        .map((data) => {
          return {
            marker: data.marker,
            type: data.type,
            value: data.value,
          };
        });

      try {
        /** Create order with Orders API */
        const { id, paymentAccountIdentifier } =
          (await getApi().Orders.createOrder(
            'order',
            {
              // ...order,
              formData: orderFormData,
              products: order.products,
              paymentAccountIdentifier: order.paymentAccountIdentifier,
              formIdentifier: order.formIdentifier,
            },
            langCode,
          )) as IBaseOrdersEntity;

        /** remove all ordered products from cart */
        order.products.forEach((product: IOrderProductData) => {
          dispatch(removeProduct(product.productId));
        });

        /** remove order */
        dispatch(removeOrder());

        if (
          ONLINE_PAYMENT_IDENTIFIERS.includes(paymentAccountIdentifier ?? '')
        ) {
          await createSession(id);
        } else {
          router.push('/orders');
        }
      } catch (error) {
        const apiError = handleApiError('onConfirmOrder', error);
        setError(apiError.message);
        setIsLoading(false);
      }
    } else {
      setError('Please select a payment method');
      setIsLoading(false);
    }
  };

  return {
    onConfirmOrder,
    isLoading,
    error,
    setError,
  };
};
