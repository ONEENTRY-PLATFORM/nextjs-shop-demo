'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { api } from '@/app/api';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { removeProduct } from '@/app/store/reducers/CartSlice';
import { removeOrder } from '@/app/store/reducers/OrderSlice';

export const useCreateOrder = ({ langCode }: { langCode: string }) => {
  const router = useRouter();
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onConfirmOrder = async (orderData?: any) => {
    try {
      setIsLoading(true);
      const orderComp = order || orderData;
      if (orderComp?.formIdentifier && orderComp?.paymentAccountIdentifier) {
        const orderFormData = orderComp.formData
          .slice()
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
            ...orderComp,
            formData: orderFormData,
            formIdentifier: orderComp.formIdentifier,
            paymentAccountIdentifier: orderComp.paymentAccountIdentifier,
          },
          langCode,
        );

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        orderComp.products.forEach((product: any) => {
          dispatch(removeProduct(product.productId));
        });
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
    createSession,
    isLoading,
    error,
  };
};
