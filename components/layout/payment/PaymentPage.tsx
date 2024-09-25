'use client';

import { Suspense, useContext, useMemo } from 'react';

import { useGetAccountsQuery } from '@/app/api';
import { useAppSelector } from '@/app/store/hooks';
import { AuthContext } from '@/app/store/providers/AuthContext';
import AuthError from '@/components/shared/AuthError';
import Loader from '@/components/shared/Loader';

import PaymentMethod from './PaymentMethod';

const PaymentPage = () => {
  const { isAuth } = useContext(AuthContext);
  const paymentMethods = useAppSelector(
    (state) => state.orderReducer.paymentMethods,
  );

  const { data, error } = useGetAccountsQuery({});

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

  if (!isAuth || error) {
    return <AuthError />;
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
