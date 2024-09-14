'use client';

import type { IOrdersByMarkersEntity } from 'oneentry/dist/orders/ordersInterfaces';
import { type Key, useContext, useEffect, useState } from 'react';

import { useGetUserOrdersQuery } from '@/app/api';
import { AuthContext } from '@/app/store/providers/AuthContext';
import AuthError from '@/components/shared/AuthError';
import Loader, { OrdersTableLoader } from '@/components/shared/Loader';

import Order from './OrderRow';

const OrdersPage = () => {
  const { isAuth } = useContext(AuthContext);
  const [ordersData, setOrdersData] = useState([] as IOrdersByMarkersEntity[]);

  const { data, isLoading } = useGetUserOrdersQuery({
    marker: 'order',
  });

  useEffect(() => {
    if (!data) {
      return;
    }
    setOrdersData(data);
  }, [data]);

  if (!isAuth) {
    return <AuthError />;
  }

  if (!data) {
    return <Loader />;
  }

  return (
    <div className="flex max-w-[730px] flex-col pb-5 max-md:max-w-full">
      <div className="w-full">
        <div className="-mb-px flex w-full border-collapse gap-4 border-y p-4 text-slate-700">
          <div className="w-1/2">Date</div>
          <div className="w-1/4">Total</div>
          <div className="w-1/4">Status</div>
        </div>
        {isLoading ? (
          <OrdersTableLoader />
        ) : (
          ordersData.map((order: IOrdersByMarkersEntity, i: Key) => {
            return <Order key={i} order={order} />;
          })
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
