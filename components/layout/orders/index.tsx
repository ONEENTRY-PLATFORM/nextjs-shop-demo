'use client';

import { useSearchParams } from 'next/navigation';
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IOrderByMarkerEntity } from 'oneentry/dist/orders/ordersInterfaces';
import type { FC, Key } from 'react';
import { useContext, useEffect, useState } from 'react';

import FadeTransition from '@/app/animations/FadeTransition';
import { getAllOrdersByMarker } from '@/app/api';
import { AuthContext } from '@/app/store/providers/AuthContext';
import AuthError from '@/components/pages/AuthError';

import LoadMore from '../products-grid/components/LoadMore';
// import Pagination from '../products-grid/Pagination';
import EmptyOrders from './components/EmptyOrders';
import Order from './components/OrderRow';
import OrdersTableLoader from './components/OrdersTableLoader';

/**
 * Orders page
 * @param lang current language shortcode
 * @param dict dictionary from server api
 * @param settings
 *
 * @returns JSX.Element
 */
const OrdersPage: FC<{
  lang: string;
  dict: IAttributeValues;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  settings: any;
}> = ({ lang, dict, settings }) => {
  const searchParams = useSearchParams();
  const { isAuth, user } = useContext(AuthContext);

  const [orders, setOrders] = useState<Array<IOrderByMarkerEntity>>();
  const [total, setTotal] = useState<number>(0);

  const currentPage = Number(searchParams.get('page')) || 0;
  const pageLimit = settings?.orders_limit.value || 10;

  // get all orders by Marker
  useEffect(() => {
    if (!isAuth) {
      return;
    }
    (async () => {
      const { isError, error, orders, total } = await getAllOrdersByMarker({
        marker: 'order',
        limit: pageLimit,
        offset: currentPage * pageLimit,
        lang,
      });
      if (orders && !isError) {
        setOrders(orders);
        setTotal(total);
      }
      if (isError) {
        console.log(error);
      }
    })();
  }, [lang, currentPage, isAuth, pageLimit, user]);

  if (!isAuth) {
    return <AuthError dict={dict} />;
  }

  if (!orders) {
    return <OrdersTableLoader limit={10} />;
  }

  if (orders && orders.length < 1) {
    return <EmptyOrders lang={lang} dict={dict} />;
  }

  const totalPages = Math.floor(total / pageLimit);
  const { date_title, total_title, status_title } = settings;

  return (
    <FadeTransition
      className="flex max-w-[730px] flex-col pb-5 max-md:max-w-full"
      index={0}
    >
      <div className="w-full">
        {/* head */}
        <div className="-mb-px flex w-full border-collapse gap-4 border-y p-4 text-slate-700">
          <div className="w-1/2">{date_title?.value}</div>
          <div className="w-1/4">{total_title?.value}</div>
          <div className="w-1/4">{status_title?.value}</div>
        </div>

        {/* orders */}
        <div className="mb-4 flex flex-col">
          {orders?.map((order: IOrderByMarkerEntity, i: Key | number) => {
            return (
              <Order
                key={i}
                index={i as number}
                order={order}
                settings={settings}
                lang={lang}
              />
            );
          })}
        </div>

        {/* LoadMore */}
        <div className="mx-auto flex flex-row justify-center">
          {/* {totalPages > 1 && <Pagination totalPages={totalPages} />} */}
          {totalPages > 1 && <LoadMore totalPages={totalPages} />}
        </div>
      </div>
    </FadeTransition>
  );
};

export default OrdersPage;
