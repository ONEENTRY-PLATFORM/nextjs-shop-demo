/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import type { IOrdersByMarkersEntity } from 'oneentry/dist/orders/ordersInterfaces';
import type { Key } from 'react';

import { useGetUserOrdersQuery } from '@/app/api';
import Loader, { OrdersTableLoader } from '@/components/shared/Loader';

import Order from './OrderRow';

const OrdersPage = () => {
  const { data, isLoading, refetch } = useGetUserOrdersQuery({
    marker: 'order',
  });

  return (
    <div className="flex max-w-[730px] flex-col pb-5 max-md:max-w-full">
      <div className="w-full">
        <div className="-mb-px flex w-full border-collapse gap-4 border-y p-4">
          <div className="w-1/2">Date</div>
          <div className="w-1/4">Total</div>
          <div className="w-1/4">Status</div>
        </div>
        {isLoading ? (
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
