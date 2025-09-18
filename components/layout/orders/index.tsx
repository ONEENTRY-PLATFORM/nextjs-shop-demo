'use client';

import { useSearchParams } from 'next/navigation';
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IOrderByMarkerEntity } from 'oneentry/dist/orders/ordersInterfaces';
import type { FC } from 'react';
import { useContext, useEffect, useState } from 'react';

import { getAllOrdersByMarker } from '@/app/api';
import { AuthContext } from '@/app/store/providers/AuthContext';
import AuthError from '@/components/pages/AuthError';

import LoadMore from '../products-grid/components/LoadMore';
import OrderRowAnimations from './animations/OrderRowAnimations';
// import Pagination from '../products-grid/Pagination';
import EmptyOrders from './components/EmptyOrders';
import Order from './components/OrderRow';
import OrdersTableLoader from './components/OrdersTableLoader';

interface OrdersPageProps {
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
}

interface OrderState {
  orders?: IOrderByMarkerEntity[] | undefined;
  total: number;
  loading: boolean;
  error?: string | undefined;
}

/**
 * Orders page
 * @param lang current language shortcode
 * @param dict dictionary from server api
 * @param settings
 *
 * @returns JSX.Element
 */
const OrdersPage: FC<OrdersPageProps> = ({ lang, dict, settings }) => {
  // Handle useSearchParams in a try/catch to prevent build errors
  let currentPage = 0;
  try {
    const searchParams = useSearchParams();
    currentPage = Number(searchParams?.get('page')) || 0;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // If useSearchParams fails (e.g. during SSR), default to page 0
    currentPage = 0;
  }

  const { isAuth } = useContext(AuthContext);

  const [orderState, setOrderState] = useState<OrderState>({
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
          offset: currentPage * pageLimit,
          limit: pageLimit,
          lang,
        });

        if (orders && !isError) {
          setOrderState((prev) => ({
            ...prev,
            orders,
            total,
            loading: false,
            error: undefined,
          }));
        }

        if (isError) {
          // eslint-disable-next-line no-console
          console.error('Failed to fetch orders:', error);
          setOrderState((prev) => ({
            ...prev,
            loading: false,
            error: error?.message || 'Failed to load orders',
          }));
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Unexpected error fetching orders:', error);
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
    <div className="orders-page">
      <div className="orders-table">
        <div className="orders-table__header">
          <div className="orders-table__header__item">
            {settings?.date_title?.value || 'Date'}
          </div>
          <div className="orders-table__header__item">
            {settings?.total_title?.value || 'Total'}
          </div>
          <div className="orders-table__header__item">
            {settings?.status_title?.value || 'Status'}
          </div>
        </div>
        <div className="orders-table__body">
          {loading ? (
            <OrdersTableLoader />
          ) : orders && orders.length > 0 ? (
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
        </div>
      </div>
      {total > pageLimit && !loading && !error && (
        <LoadMore totalPages={total} />
      )}
    </div>
  );
};

export default OrdersPage;
