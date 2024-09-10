/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import type { IOrdersByMarkersEntity } from 'oneentry/dist/orders/ordersInterfaces';
import type { Key } from 'react';

import { useGetSingleOrderQuery } from '@/app/api';
import Loader from '@/components/shared/Loader';

const OrderPage = () => {
  const { data, isLoading, refetch } = useGetSingleOrderQuery({
    marker: 'order',
    id: 135,
    activeLang: 'en_US',
  });
  console.log(data);

  return (
    <div className="flex max-w-[730px] flex-col pb-5 max-md:max-w-full"></div>
  );
};

export default OrderPage;
