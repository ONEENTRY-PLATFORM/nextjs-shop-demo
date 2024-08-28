'use client';

import Link from 'next/link';
import { Suspense } from 'react';

import { useGetUserOrdersQuery } from '@/app/api';
import Loader from '@/components/shared/Loader';
import { UsePrice } from '@/components/utils';

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
            const formattedPrice = UsePrice({
              amount: totalSum,
              currency: currency,
            });
            return (
              <Link href={'/orders/' + id} key={i} className="flex gap-4">
                <div>{createdDate}</div>
                <div>{formattedPrice}</div>
              </Link>
            );
          })}
        </div>
      </Suspense>
    </div>
  );
};

export default OrdersPage;
