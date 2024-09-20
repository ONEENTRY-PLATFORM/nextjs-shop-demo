'use client';

import type { IOrderByMarkerEntity } from 'oneentry/dist/orders/ordersInterfaces';
import { type Key, useContext } from 'react';

import { useGetUserOrders } from '@/app/api/hooks/useGetUserOrders';
import { AuthContext } from '@/app/store/providers/AuthContext';
import AuthError from '@/components/shared/AuthError';
import { OrdersTableLoader } from '@/components/shared/Loader';

import Order from './OrderRow';

const OrdersPage = () => {
  const { isAuth } = useContext(AuthContext);

  const { orders, loading } = useGetUserOrders({
    marker: 'order',
  });

  if (!isAuth) {
    return <AuthError />;
  }

  return (
    <div className="flex max-w-[730px] flex-col pb-5 max-md:max-w-full">
      <div className="w-full">
        <div className="-mb-px flex w-full border-collapse gap-4 border-y p-4 text-slate-700">
          <div className="w-1/2">Date</div>
          <div className="w-1/4">Total</div>
          <div className="w-1/4">Status</div>
        </div>
        {!orders || loading ? (
          <OrdersTableLoader />
        ) : (
          orders?.items.map((order: IOrderByMarkerEntity, i: Key) => {
            return <Order key={i} order={order} />;
          })
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
