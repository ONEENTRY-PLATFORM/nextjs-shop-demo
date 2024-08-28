'use client';

import Link from 'next/link';
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
        <div className="w-full">
          {data?.map((order, i) => {
            const {
              id,
              createdDate,
              currency,
              // paymentAccountLocalizeInfos,
              // products,
              // statusIdentifier,
              totalSum,
            } = order;
            return (
              <Link href={'/orders/' + id} key={i}>
                <div>{createdDate}</div>
                <div>{currency}</div>
                <div>{totalSum}</div>
              </Link>
            );
          })}
        </div>
      </Suspense>
    </div>
  );
};

export default OrdersPage;
