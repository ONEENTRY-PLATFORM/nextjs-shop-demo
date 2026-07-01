import type { JSX } from 'react';

import WithSidebarLoader from '@/components/layout/sidebar/components/WithSidebarLoader';

import OrdersTableLoader from './OrdersTableLoader';

/**
 * OrdersLoader — skeleton for the orders page. Mirrors the real layout: the
 * {@link WithSidebarLoader} (sidebar + main area) with the orders table — a
 * header row (Date / Total / Status) above the animated
 * {@link OrdersTableLoader} rows.
 * @param   {object}      props       - Component props.
 * @param   {number}      props.limit - Number of order-row placeholders.
 * @returns {JSX.Element}             Animated skeleton for the orders page.
 */
const OrdersLoader = ({ limit = 5 }: { limit?: number }): JSX.Element => {
  return (
    <WithSidebarLoader>
      <div className="flex max-w-182.5 flex-col pb-5 max-md:max-w-full">
        <div className="orders-table">
          {/** Table header — Date / Total / Status columns */}
          <div className="border-muted -mb-px flex w-full gap-4 border-y p-4">
            <div className="animate-loader h-5 w-1/2 rounded-full" />
            <div className="animate-loader h-5 w-1/4 rounded-full" />
            <div className="animate-loader h-5 w-1/4 rounded-full" />
          </div>

          {/** Table body — animated skeleton rows */}
          <OrdersTableLoader limit={limit} />
        </div>
      </div>
    </WithSidebarLoader>
  );
};

export default OrdersLoader;
