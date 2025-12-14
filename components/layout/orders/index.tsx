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
 * Displays a list of user orders with pagination and loading states.
 * @param   {object}           props                             - Component props
 * @param   {string}           props.lang                        - Current language shortcode (e.g., 'en', 'ru')
 * @param   {IAttributeValues} props.dict                        - Dictionary containing localized texts
 * @param   {object}           props.settings                    - Settings from server API
 * @param   {object}           props.settings.orders_limit       - Orders limit configuration
 * @param   {number}           props.settings.orders_limit.value - Number of orders per page
 * @param   {object}           props.settings.date_title         - Date column title configuration
 * @param   {string}           props.settings.date_title.value   - Date column title text
 * @param   {object}           props.settings.total_title        - Total column title configuration
 * @param   {string}           props.settings.total_title.value  - Total column title text
 * @param   {object}           props.settings.status_title       - Status column title configuration
 * @param   {string}           props.settings.status_title.value - Status column title text
 * @returns {JSX.Element}                                        Orders page with list of orders and pagination
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
  /** Handle useSearchParams in a try/catch to prevent build errors during SSR */
  let currentPage = 1;
  try {
    const searchParams = useSearchParams();
    currentPage = Number(searchParams?.get('page')) || 1;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    /** If useSearchParams fails (e.g. during SSR), default to page 1 */
    currentPage = 1;
  }

  /** Get authentication status from context */
  const { isAuth } = useContext(AuthContext);

  /** State management for orders data, loading, and errors */
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

  /** Determine page limit from settings or default to 10 */
  const pageLimit = settings?.orders_limit?.value || 10;

  /** Fetch orders when authentication status, current page, page limit, or language changes */
  useEffect(() => {
    /** If user is not authenticated, stop loading and return */
    if (!isAuth) {
      setOrderState((prev) => ({ ...prev, loading: false }));
      return;
    }

    /** Function to fetch orders from the API */
    const fetchOrders = async () => {
      try {
        /** Set loading state and clear any previous errors */
        setOrderState((prev) => ({ ...prev, loading: true, error: undefined }));

        /** Fetch orders using the API function */
        const { isError, error, orders, total } = await getAllOrdersByMarker({
          marker: 'order',
          offset: (currentPage - 1) * pageLimit,
          limit: pageLimit,
          lang,
        });

        /** Process successful response */
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

        /** Handle API errors */
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
        /** Handle unexpected errors */
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

  /** Destructure order state for easier access */
  const { orders, total, loading, error } = orderState;

  /** Show authentication error if user is not logged in */
  if (!isAuth) {
    return <AuthError dict={dict} />;
  }

  /** Render the orders page with fade transition */
  return (
    <FadeTransition
      className="flex max-w-182.5 flex-col pb-5 max-md:max-w-full"
      index={0}
    >
      <div className="orders-page">
        <div className="orders-table">
          {/* Orders table header with column titles */}
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

          {/* Orders table body with actual order data */}
          <div className="orders-table__body mb-4 flex flex-col">
            {/* Show loader on initial load */}
            {loading && currentPage === 1 ? (
              <OrdersTableLoader />
            ) : Array.isArray(orders) && orders.length > 0 ? (
              /** Map through orders and display each one */
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
              /** Show empty orders message when no orders are found */
              <EmptyOrders lang={lang} dict={dict} />
            )}
            {/* Show loading message when loading more orders */}
            {loading && currentPage > 0 && (
              <div className="p-4 text-center">Loading more orders...</div>
            )}
          </div>
        </div>
        {/* Load more button for pagination */}
        {}
        {total > currentPage * pageLimit && !loading && !error && (
          <LoadMore totalPages={Math.ceil(total / pageLimit)} />
        )}
      </div>
    </FadeTransition>
  );
};

export default OrdersPage;
