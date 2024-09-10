/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import type { IOrdersByMarkersEntity } from 'oneentry/dist/orders/ordersInterfaces';
import type { Key } from 'react';

import { useGetUserOrdersQuery } from '@/app/api';
import Loader, { OrdersTableLoader } from '@/components/shared/Loader';

import Order from './OrderRow';

const OrderPage = () => {
  const { data, isLoading, refetch } = useGetUserOrdersQuery({
    marker: 'order',
  });

  return (
    <div className="flex max-w-[730px] flex-col pb-5 max-md:max-w-full"></div>
  );
};

export default OrderPage;
