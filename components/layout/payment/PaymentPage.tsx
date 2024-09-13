'use client';

import { Suspense, useContext, useMemo, useState } from 'react';

import { useGetAccountsQuery } from '@/app/api';
import { useAppSelector } from '@/app/store/hooks';
import { AuthContext } from '@/app/store/providers/AuthContext';
import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';
import AuthError from '@/components/shared/AuthError';
import Loader from '@/components/shared/Loader';

import PaymentMethod from './PaymentMethod';

const PaymentPage = () => {
  const { data, error } = useGetAccountsQuery({});
  const { isAuth } = useContext(AuthContext);
  const [selected, setSelected] = useState<number | undefined>();
  const paymentMethods = useAppSelector(
    (state) => state.orderReducer.paymentMethods,
  );
  const { setOpen, setComponent } = useContext(OpenDrawerContext);

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

  if (error) {
    return <Loader />;
  }

  return (
    <div className="flex max-w-[730px] flex-col gap-5 pb-5 max-md:max-w-full">
      <Suspense fallback={<Loader />}>
        {whitelistMethods.map((item, index) => {
          return (
            <PaymentMethod
              selected={selected}
              setSelected={setSelected}
              key={index}
              index={index}
              account={item}
            />
          );
        })}
      </Suspense>
    </div>
  );
};

export default PaymentPage;
