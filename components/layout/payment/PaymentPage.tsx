'use client';

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
  const dispatch = useAppDispatch();

  const { isAuth } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(true);

  const { data, error } = useGetAccountsQuery({});
  const [selected, setSelected] = useState<number | undefined>();
  const paymentMethods = useAppSelector(
    (state) => state.orderReducer.paymentMethods,
  );
  const order = useAppSelector((state) => state.orderReducer.order);

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

    const { paymentUrl, id: orderId } = await api.Payments.createSession(
      id,
      'session',
    );
    if (order?.paymentAccountIdentifier === 'cash') {
      // return navigate('payment_success', { id });
      return 'payment_success';
    }

    if (paymentUrl) {
      // navigate('payment_method', { orderId, paymentUrl });
      return 'payment_method';
    }
  };

  const onConfirmOrder = async () => {
    setIsLoading(true);
    try {
      if (order?.formIdentifier && order?.paymentAccountIdentifier) {
        const editedFormData = order.formData.slice().map((data) => {
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
            formData: editedFormData,
            formIdentifier: order.formIdentifier,
            paymentAccountIdentifier: order.paymentAccountIdentifier,
          },
        );

        dispatch(removeAllProducts());
        dispatch(removeOrder());

        if (paymentAccountIdentifier !== 'cash') {
          await createSession(id);
        } else {
          // return navigate('orders');
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.error(e);
    }
    setIsLoading(false);
  };

  if (!isAuth || error) {
    return <AuthError />;
  }

  if (error) {
    return <Loader />;
  }

  return (
    <div className="flex max-w-[730px] flex-col gap-5 pb-5 max-md:max-w-full">
      <Suspense fallback={<Loader />}>
        {whitelistMethods.map((item, index) => {
          return <PaymentMethod key={index} account={item} />;
        })}
      </Suspense>
    </div>
  );
};

export default PaymentPage;
