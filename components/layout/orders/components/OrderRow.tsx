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
 * Order row
 * @param   {OrderRowProps}                       order          - Order entity
 * @param   {IOrderByMarkerEntity}                order.order    -Entity
 * @param   {Record<string, unknown> | undefined} order.settings - Settings
 * @param   {string}                              order.lang     - Language
 * @param   {number}                              order.index    - Index
 * @returns {JSX.Element}                                        - Order row
 */
const OrderRow = ({
  order,
  settings,
  lang,
  index,
}: OrderRowProps): JSX.Element => {
  const { id, createdDate, statusIdentifier, totalSum } = order;

  const formattedPrice = UsePrice({
    amount: totalSum,
    lang,
  });
  const date = new Date(createdDate).toUTCString();
  const [state, setState] = useState(false);
  const rowClass = !state
    ? 'text-slate-700 hover:text-orange-500'
    : 'text-orange-500';

  return (
    <OrderRowAnimations className="w-full" index={index}>
      <button
        onClick={() => {
          setState(!state);
        }}
        className={
          '-mb-px flex cursor-pointer w-full gap-4 border-y border-[#B0BCCE] p-4 text-left ' +
          rowClass
        }
      >
        <div className="w-1/2">{date}</div>
        <div className="w-1/4">{formattedPrice}</div>
        <div className="w-1/4">{statusIdentifier}</div>
      </button>
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
