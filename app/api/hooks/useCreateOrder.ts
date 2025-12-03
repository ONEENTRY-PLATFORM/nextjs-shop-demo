/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useTransitionRouter } from 'next-transition-router';
import type { IOrderProductData } from 'oneentry/dist/orders/ordersInterfaces';
import { useState } from 'react';

import { api } from '@/app/api';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { removeProduct } from '@/app/store/reducers/CartSlice';
import { removeOrder } from '@/app/store/reducers/OrderSlice';
import { handleApiError } from '@/app/utils/errorHandler';

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
  onConfirmOrder: any;
  isLoading: any;
  error: any;
  setError: any;
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
      const { paymentUrl } = await api.Payments.createSession(id, 'session');
      /** Handle cash payment method */
      if (order?.paymentAccountIdentifier === 'cash') {
        router.push('/orders');
        return 'payment_success';
      }
      /** Redirect to payment URL if available */
      if (paymentUrl) {
        router.push(paymentUrl);
        return 'payment_method';
      }
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
        .map((data: { marker: string; type: string; value: any }) => {
          return {
            marker: data.marker,
            type: data.type,
            value: data.value,
          };
        });

      try {
        /** Create order with Orders API */
        const { id, paymentAccountIdentifier } = await api.Orders.createOrder(
          'order',
          {
            // ...order,
            formData: orderFormData,
            products: order.products,
            paymentAccountIdentifier: order.paymentAccountIdentifier,
            formIdentifier: order.formIdentifier,
          },
          langCode,
        );

        /** remove all ordered products from cart */
        order.products.forEach((product: IOrderProductData) => {
          dispatch(removeProduct(product.productId));
        });

        /** remove order */
        dispatch(removeOrder());

        if (paymentAccountIdentifier !== 'cash') {
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
