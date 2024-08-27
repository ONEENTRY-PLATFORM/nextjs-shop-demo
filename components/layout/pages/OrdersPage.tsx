'use client';

import { Suspense } from 'react';

import { useGetUserOrdersQuery } from '@/app/api';
import Loader from '@/components/shared/Loader';

const OrdersPage = () => {
  const { data, isLoading, refetch } = useGetUserOrdersQuery({
    marker: 'order',
  });

  return (
    <div className="flex max-w-[730px] flex-col pb-5 max-md:max-w-full">
      <Suspense fallback={<Loader />}>
        <table className="w-full">
          {data?.map((order, i) => {
            const {
              createdDate,
              currency,
              paymentAccountLocalizeInfos,
              products,
              statusIdentifier,
              totalSum,
            } = order;
            return (
              <tr key={i}>
                <td>{createdDate}</td>
                <td>{currency}</td>
                <td>{totalSum}</td>
              </tr>
            );
          })}
        </table>
      </Suspense>
    </div>
  );
};

export default OrdersPage;
