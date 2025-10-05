'use client';

import { useSearchParams } from 'next/navigation';
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IOrderByMarkerEntity } from 'oneentry/dist/orders/ordersInterfaces';
import type { JSX } from 'react';
import { useContext, useEffect, useState } from 'react';

import FadeTransition from '@/app/animations/FadeTransition';
import { getAllOrdersByMarker } from '@/app/api';
import { AuthContext } from '@/app/store/providers/AuthContext';
import AuthError from '@/components/pages/AuthError';

import LoadMore from '../products-grid/components/LoadMore';
import OrderRowAnimations from './animations/OrderRowAnimations';
// import Pagination from '../products-grid/Pagination';
import EmptyOrders from './components/EmptyOrders';
import Order from './components/OrderRow';
import OrdersTableLoader from './components/OrdersTableLoader';

/**
 * Orders page component.
 * @param   {object}           props                             - Props for the component.
 * @param   {string}           props.lang                        - current language shortcode.
 * @param   {IAttributeValues} props.dict                        - dictionary from server api.
 * @param   {object}           props.settings                    - settings from server api.
 * @param   {object}           props.settings.orders_limit       - orders limit.
 * @param   {number}           props.settings.orders_limit.value - orders limit value.
 * @param   {object}           props.settings.date_title         - date title.
 * @param   {string}           props.settings.date_title.value   - date title value.
 * @param   {object}           props.settings.total_title        - total title.
 * @param   {string}           props.settings.total_title.value  - total title value.
 * @param   {object}           props.settings.status_title       - status title.
 * @param   {string}           props.settings.status_title.value - status title value.
 * @returns {JSX.Element}                                        JSX.Element
 */
const OrdersPage = ({
  lang,
  dict,
  settings,
}: {
  lang: string;
  dict: IAttributeValues;
  settings: {
    orders_limit?: {
      value: number;
    };
    date_title?: {
      value: string;
    };
    total_title?: {
      value: string;
    };
    status_title?: {
      value: string;
    };
  };
}): JSX.Element => {
  // Handle useSearchParams in a try/catch to prevent build errors
  let currentPage = 1;
  try {
    const searchParams = useSearchParams();
    currentPage = Number(searchParams?.get('page')) || 1;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // If useSearchParams fails (e.g. during SSR), default to page 1
    currentPage = 1;
  }

  const { isAuth } = useContext(AuthContext);

  const [orderState, setOrderState] = useState<{
    orders?: IOrderByMarkerEntity[] | undefined;
    total: number;
    loading: boolean;
    error?: string | undefined;
  }>({
    orders: undefined,
    total: 0,
    loading: true,
    error: undefined,
  });

  const pageLimit = settings?.orders_limit?.value || 10;

  // get all orders by Marker
  useEffect(() => {
    if (!isAuth) {
      setOrderState((prev) => ({ ...prev, loading: false }));
      return;
    }

    const fetchOrders = async () => {
      try {
        setOrderState((prev) => ({ ...prev, loading: true, error: undefined }));

        const { isError, error, orders, total } = await getAllOrdersByMarker({
          marker: 'order',
          offset: (currentPage - 1) * pageLimit,
          limit: pageLimit,
          lang,
        });

        if (orders && !isError) {
          setOrderState((prev) => ({
            ...prev,
            orders:
              currentPage === 1 ? orders : [...(prev.orders || []), ...orders],
            total,
            loading: false,
            error: undefined,
          }));
        }

        if (isError) {
          // eslint-disable-next-line no-console
          console.log('Failed to fetch orders:', error);
          setOrderState((prev) => ({
            ...prev,
            loading: false,
            error: error?.message || 'Failed to load orders',
          }));
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('Unexpected error fetching orders:', error);
        setOrderState((prev) => ({
          ...prev,
          loading: false,
          error: 'An unexpected error occurred',
        }));
      }
    };

    fetchOrders();
  }, [isAuth, currentPage, pageLimit, lang]);

  const { orders, total, loading, error } = orderState;

  if (!isAuth) {
    return <AuthError dict={dict} />;
  }

  return (
    <FadeTransition
      className="flex max-w-[730px] flex-col pb-5 max-md:max-w-full"
      index={0}
    >
      <div className="orders-page">
        <div className="orders-table">
          {/* head */}
          <OrderRowAnimations className="w-full" index={0}>
            <div className="-mb-px flex w-full border-collapse gap-4 border-y border-[#B0BCCE] p-4 text-slate-700">
              <div className="w-1/2">
                {settings?.date_title?.value || 'Date'}
              </div>
              <div className="w-1/4">
                {settings?.total_title?.value || 'Total'}
              </div>
              <div className="w-1/4">
                {settings?.status_title?.value || 'Status'}
              </div>
            </div>
          </OrderRowAnimations>
          <div className="orders-table__body mb-4 flex flex-col">
            {loading && currentPage === 1 ? (
              <OrdersTableLoader />
            ) : Array.isArray(orders) && orders.length > 0 ? (
              orders.map((order, index) => (
                <OrderRowAnimations key={order.id} className={''} index={0}>
                  <Order
                    order={order}
                    settings={settings}
                    lang={lang}
                    index={index}
                  />
                </OrderRowAnimations>
              ))
            ) : (
              <EmptyOrders lang={''} dict={dict} />
            )}
            {loading && currentPage > 0 && (
              <div className="p-4 text-center">Loading more orders...</div>
            )}
          </div>
        </div>
        {}
        {total > currentPage * pageLimit && !loading && !error && (
          <LoadMore totalPages={Math.ceil(total / pageLimit)} />
        )}
      </div>
    </FadeTransition>
  );
};

export default OrdersPage;
