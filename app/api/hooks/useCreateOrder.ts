'use client';

import { useTransitionRouter } from 'next-transition-router';
import { useState } from 'react';

import { api } from '@/app/api';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { removeProduct } from '@/app/store/reducers/CartSlice';
import { removeOrder } from '@/app/store/reducers/OrderSlice';

export const useCreateOrder = ({ langCode }: { langCode: string }) => {
  const router = useTransitionRouter();
  const dispatch = useAppDispatch();
  const order = useAppSelector((state) => state.orderReducer.order);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const createSession = async (id: number) => {
    if (!id) {
      return;
    }
    setIsLoading(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { paymentUrl, id: orderId } = await api.Payments.createSession(
        id,
        'session',
      );
      if (order?.paymentAccountIdentifier === 'cash') {
        router.push('/orders');
        return 'payment_success';
      }
      if (paymentUrl) {
        router.push(paymentUrl);
        return 'payment_method';
      }
      setIsLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e.message);
      setIsLoading(false);
    }
  };

  const onConfirmOrder = async () => {
    setIsLoading(true);
    if (order?.formIdentifier && order?.paymentAccountIdentifier) {
      const orderFormData = order.formData
        .slice()
        .filter((element) => element.marker !== 'time')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((data: { marker: string; type: string; value: any }) => {
          return {
            marker: data.marker,
            type: data.type,
            value: data.value,
          };
        });
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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      order.products.forEach((product: any) => {
        dispatch(removeProduct(product.productId));
      });
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
