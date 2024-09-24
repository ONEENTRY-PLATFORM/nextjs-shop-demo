'use client';
import { useSearchParams } from 'next/navigation';
import type { IOrderByMarkerEntity } from 'oneentry/dist/orders/ordersInterfaces';
import { type Key, useContext } from 'react';

import { useGetUserOrders } from '@/app/api/hooks/useGetUserOrders';
import { AuthContext } from '@/app/store/providers/AuthContext';
import AuthError from '@/components/shared/AuthError';
import { OrdersTableLoader } from '@/components/shared/Loader';

import Pagination from '../catalog/Pagination';
import Order from './OrderRow';

const OrdersPage = () => {
  const pageLimit = 10;
  const langCode = 'en_US';
  const { isAuth } = useContext(AuthContext);
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get('page')) || 0;

  const { orders, loading, total } = useGetUserOrders({
    marker: 'order',
    langCode: langCode,
    limit: pageLimit,
    offset: currentPage * pageLimit,
  });

  const totalPages = total / pageLimit;

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
        <div className="mb-4 flex flex-col">
          {!orders || loading ? (
            <OrdersTableLoader />
          ) : (
            orders?.items.map((order: IOrderByMarkerEntity, i: Key) => {
              return <Order key={i} order={order} />;
            })
          )}
        </div>
        <div className="mx-auto flex flex-row justify-center">
          {totalPages > 1 && <Pagination totalPages={totalPages} />}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
