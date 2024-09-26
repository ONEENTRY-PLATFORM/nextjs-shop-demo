'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { api } from '@/app/api';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { removeAllProducts } from '@/app/store/reducers/CartSlice';
import { removeOrder } from '@/app/store/reducers/OrderSlice';

export const useCreateOrder = () => {
  const langCode = 'en_US';
  const router = useRouter();
  const dispatch = useAppDispatch();
  const order = useAppSelector((state) => state.orderReducer.order);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const createSession = async (id: number) => {
    if (!id) {
      return;
    }

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
  };

  const onConfirmOrder = async () => {
    try {
      setIsLoading(true);
      if (order?.formIdentifier && order?.paymentAccountIdentifier) {
        const orderFormData = order.formData.slice().map((data) => {
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

        dispatch(removeAllProducts());
        dispatch(removeOrder());

        if (paymentAccountIdentifier !== 'cash') {
          await createSession(id);
        } else {
          router.push('/orders');
        }
        setIsLoading(false);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e.message);
      setIsLoading(false);
    }
  };

  return {
    onConfirmOrder,
    isLoading,
    error,
  };
};
