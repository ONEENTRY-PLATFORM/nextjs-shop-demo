'use client';

import { useSearchParams } from 'next/navigation';
import type { IOrderByMarkerEntity } from 'oneentry/dist/orders/ordersInterfaces';
import type { FC, Key } from 'react';
import { useContext, useEffect, useState } from 'react';

import { getAllOrdersByMarker, getBlockByMarker } from '@/app/api';
import { AuthContext } from '@/app/store/providers/AuthContext';
import AuthError from '@/components/shared/AuthError';
import Loader from '@/components/shared/Loader';

import LoadMore from '../products-grid/components/LoadMore';
// import Pagination from '../products-grid/Pagination';
import EmptyOrders from './components/EmptyOrders';
import Order from './components/OrderRow';
import OrdersTableLoader from './components/OrdersTableLoader';

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
const OrdersPage: FC<{ lang: string; page: any }> = ({ lang, page }) => {
  const searchParams = useSearchParams();
  const { isAuth, user } = useContext(AuthContext);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [settings, setSettings] = useState<Record<string, any>>();
  const [orders, setOrders] = useState<Array<IOrderByMarkerEntity>>();
  const [total, setTotal] = useState<number>(0);

  const currentPage = Number(searchParams.get('page')) || 0;
  const pageLimit = settings?.orders_limit.value || 10;

  useEffect(() => {
    if (!isAuth) {
      return;
    }
    (async () => {
      const { block } = await getBlockByMarker('orders_settings', lang);
      if (block) {
        setSettings(block.attributeValues);
      }
      if (pageLimit) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { isError, orders, total } = await getAllOrdersByMarker({
          marker: 'order',
          limit: pageLimit,
          offset: currentPage * pageLimit,
          lang,
        });
        if (orders) {
          setOrders(orders);
          setTotal(total);
        }
      }
    })();
  }, [lang, currentPage, isAuth, pageLimit, user]);

  if (!settings) {
    return <Loader />;
  }

  if (!isAuth || !user) {
    return <AuthError />;
  }

  const totalPages = Math.floor(total / pageLimit);
  const { date_title, total_title, status_title } = settings;

  if (orders && orders.length < 1) {
    return <EmptyOrders lang={lang} />;
  }

  return (
    <div className="flex max-w-[730px] flex-col pb-5 max-md:max-w-full">
      <div className="w-full">
        <div className="-mb-px flex w-full border-collapse gap-4 border-y p-4 text-slate-700">
          <div className="w-1/2">{date_title?.value}</div>
          <div className="w-1/4">{total_title?.value}</div>
          <div className="w-1/4">{status_title?.value}</div>
        </div>
        <div className="mb-4 flex flex-col">
          {!orders ? (
            <OrdersTableLoader />
          ) : (
            orders?.map((order: IOrderByMarkerEntity, i: Key | number) => {
              return (
                <Order key={i} order={order} settings={settings} lang={lang} index={i as number} />
              );
            })
          )}
        </div>
        <div className="mx-auto flex flex-row justify-center">
          {/* {totalPages > 1 && <Pagination totalPages={totalPages} />} */}
          {totalPages > 1 && <LoadMore totalPages={totalPages} />}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
