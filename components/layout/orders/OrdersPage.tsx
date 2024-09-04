/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import type { IOrdersByMarkersEntity } from 'oneentry/dist/orders/ordersInterfaces';
import type { Key } from 'react';
import { Suspense } from 'react';

import { useGetUserOrdersQuery } from '@/app/api';
import Loader from '@/components/shared/Loader';

import Order from './OrderRow';

const OrdersPage = () => {
  const { data, isLoading, refetch } = useGetUserOrdersQuery({
    marker: 'order',
  });

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="flex max-w-[730px] flex-col pb-5 max-md:max-w-full">
      <div className="w-full">
        {data?.map((order: IOrdersByMarkersEntity, i: Key) => {
          return <Order key={i} order={order} />;
        })}
      </div>
    </div>
  );
};

export default OrdersPage;
