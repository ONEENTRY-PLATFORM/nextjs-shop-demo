'use client';

import { Suspense, useMemo, useState } from 'react';

import { useGetAccountsQuery } from '@/app/api';
import { useAppSelector } from '@/app/store/hooks';
import Loader from '@/components/shared/Loader';

import PaymentMethod from './PaymentMethod';

const PaymentPage = () => {
  const { data } = useGetAccountsQuery({});
  const [selected, setSelected] = useState<number | undefined>();
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
  }, [data]);

  return (
    <div className="flex max-w-[730px] flex-col pb-5 max-md:max-w-full">
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
