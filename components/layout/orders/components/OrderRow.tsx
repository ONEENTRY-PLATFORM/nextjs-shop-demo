import type { IOrderByMarkerEntity } from 'oneentry/dist/orders/ordersInterfaces';
import type { JSX } from 'react';
import { useState } from 'react';

import { UsePrice } from '@/components/utils/utils';

import OrderRowAnimations from '../animations/OrderRowAnimations';
import OrderPage from './OrderPage';

interface OrderRowProps {
  order: IOrderByMarkerEntity;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  settings: Record<string, any> | undefined;
  lang: string;
  index: number;
}

/**
 * Order row component.
 * Represents a single order in a list view with expandable details.
 * Displays basic order information and allows expanding to show full order details.
 * @param   {OrderRowProps}                       props          - Order row component props
 * @param   {IOrderByMarkerEntity}                props.order    - Order entity containing order data
 * @param   {Record<string, unknown> | undefined} props.settings - Settings for localization and configuration
 * @param   {string}                              props.lang     - Current language shortcode for formatting
 * @param   {number}                              props.index    - Index of the row for staggered animations
 * @returns {JSX.Element}                                        Order row with expandable details
 */
const OrderRow = ({
  order,
  settings,
  lang,
  index,
}: OrderRowProps): JSX.Element => {
  /** Extract relevant order data */
  const { id, createdDate, statusIdentifier, totalSum } = order;

  /** Format the total amount using the UsePrice utility */
  const formattedPrice = UsePrice({
    amount: totalSum,
    lang,
  });

  /** Format the order creation date */
  const date = new Date(createdDate).toUTCString();

  /** State to track if the order details are expanded */
  const [state, setState] = useState(false);

  /** Determine row styling based on expanded state */
  const rowClass = !state
    ? 'text-slate-700 hover:text-orange-500'
    : 'text-orange-500';

  /** Render the order row with animations */
  return (
    <OrderRowAnimations className="w-full" index={index}>
      {/** Order summary row that can be clicked to expand details */}
      <button
        onClick={() => {
          setState(!state);
        }}
        className={
          '-mb-px flex cursor-pointer w-full gap-4 border-y border-[#B0BCCE] p-4 text-left ' +
          rowClass
        }
      >
        {/** Display order creation date */}
        <div className="w-1/2">{date}</div>
        {/** Display formatted order total */}
        <div className="w-1/4">{formattedPrice}</div>
        {/** Display order status */}
        <div className="w-1/4">{statusIdentifier}</div>
      </button>
      {/** Expanded order details page, shown when state is true */}
      <OrderPage
        id={Number(id)}
        settings={settings}
        isActive={state}
        lang={lang}
      />
    </OrderRowAnimations>
  );
};

export default OrderRow;
