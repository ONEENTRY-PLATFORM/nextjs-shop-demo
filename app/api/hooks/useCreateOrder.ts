/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useTransitionRouter } from 'next-transition-router';
import type { IOrderProductData } from 'oneentry/dist/orders/ordersInterfaces';
import { useState } from 'react';

import { api } from '@/app/api';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { removeProduct } from '@/app/store/reducers/CartSlice';
import { removeOrder } from '@/app/store/reducers/OrderSlice';

/**
 * Create order function
 * @param langCode current language code
 * @returns useCreateOrder object
 */
export const useCreateOrder = ({ langCode }: { langCode: string }) => {
  const router = useTransitionRouter();
  const dispatch = useAppDispatch();
  const order = useAppSelector((state) => state.orderReducer.order);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  /**
   * Create payment session with Payments API
   * @async
   * @see {@link https://doc.oneentry.cloud/docs/payments OneEntry CMS docs}
   * @returns payment state marker
   */
  const createSession = async (id: number) => {
    if (!id) {
      return;
    }
    setIsLoading(true);

    try {
      const { paymentUrl } = await api.Payments.createSession(id, 'session');
      if (order?.paymentAccountIdentifier === 'cash') {
        router.push('/orders');
        return 'payment_success';
      }
      if (paymentUrl) {
        router.push(paymentUrl);
        return 'payment_method';
      }
      setIsLoading(false);
    } catch (e: any) {
      setError(e.message);
      setIsLoading(false);
    }
  };

  /**
   * On confirm order Create order with Orders API
   * @async
   * @returns void
   */
  const onConfirmOrder = async () => {
    setIsLoading(true);
    if (order?.formIdentifier && order?.paymentAccountIdentifier) {
      // prepare order data
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

      // Create order with Orders API
      const { id, paymentAccountIdentifier } = await api.Orders.createOrder(
        'order',
        {
          ...order,
          formData: orderFormData,
          formIdentifier: order.formIdentifier,
          paymentAccountIdentifier: order.paymentAccountIdentifier,
        },
        langCode,
      );

      // remove all ordered products from cart
      order.products.forEach((product: IOrderProductData) => {
        dispatch(removeProduct(product.productId));
      });

      // remove order
      dispatch(removeOrder());

      if (paymentAccountIdentifier !== 'cash') {
        await createSession(id);
      } else {
        router.push('/orders');
      }
    }
    setIsLoading(false);
  };

  return {
    onConfirmOrder,
    createSession,
    isLoading,
    error,
  };
};
