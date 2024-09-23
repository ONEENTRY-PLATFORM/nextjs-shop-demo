'use client';

import { useRouter } from 'next/navigation';
import { Suspense, useContext, useMemo, useState } from 'react';

import { api, useGetAccountsQuery } from '@/app/api';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { AuthContext } from '@/app/store/providers/AuthContext';
import { removeAllProducts } from '@/app/store/reducers/CartSlice';
import { removeOrder } from '@/app/store/reducers/OrderSlice';
import AuthError from '@/components/shared/AuthError';
import Loader from '@/components/shared/Loader';

import PaymentMethod from './PaymentMethod';

const PaymentPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isAuth } = useContext(AuthContext);
  const { data, error } = useGetAccountsQuery({});

  const [isLoading, setIsLoading] = useState(false);

  const order = useAppSelector((state) => state.orderReducer.order);
  const paymentMethods = useAppSelector(
    (state) => state.orderReducer.paymentMethods,
  );

  const whitelistMethods = useMemo(() => {
    if (data) {
      return data.filter((method) => {
        const index = paymentMethods?.findIndex(
          (whitelistMethod) => method.identifier === whitelistMethod.identifier,
        );
        if (index !== -1) {
          return method;
        }
      });
    }
    return [];
  }, [data, paymentMethods]);

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
    console.log(paymentUrl);

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
          'en_US',
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
      console.error(e);
      setIsLoading(false);
    }
  };

  const onEditOrder = async () => {
    router.push('/cart');
  };

  if (!isAuth || error) {
    return <AuthError />;
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="flex max-w-[730px] flex-col gap-5 pb-5 max-md:max-w-full">
      <Suspense fallback={<Loader />}>
        {whitelistMethods.map((item, index) => {
          return (
            <PaymentMethod
              key={index}
              account={item}
              onConfirmOrder={onConfirmOrder}
              onEditOrder={onEditOrder}
            />
          );
        })}
      </Suspense>
    </div>
  );
};

export default PaymentPage;
