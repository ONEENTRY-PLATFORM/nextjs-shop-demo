'use client';

import type { IOrdersByMarkersEntity } from 'oneentry/dist/orders/ordersInterfaces';
import { type Key, useContext } from 'react';

import { useGetUserOrdersQuery } from '@/app/api';
import { AuthContext } from '@/app/store/providers/AuthContext';
import AuthError from '@/components/shared/AuthError';
import { OrdersTableLoader } from '@/components/shared/Loader';

import Order from './OrderRow';

// export const revalidate = 10;
// export const dynamicParams = true;

const OrdersPage = () => {
  const { isAuth } = useContext(AuthContext);

  const { data, isLoading } = useGetUserOrdersQuery({
    marker: 'order',
  });

  if (!isAuth) {
    return <AuthError />;
  }
  console.log({ data, isLoading });

  return (
    <div className="flex max-w-[730px] flex-col pb-5 max-md:max-w-full">
      <div className="w-full">
        <div className="-mb-px flex w-full border-collapse gap-4 border-y p-4 text-slate-700">
          <div className="w-1/2">Date</div>
          <div className="w-1/4">Total</div>
          <div className="w-1/4">Status</div>
        </div>
        {!data ? (
          <OrdersTableLoader />
        ) : (
          data?.map((order: IOrdersByMarkersEntity, i: Key) => {
            return <Order key={i} order={order} />;
          })
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
