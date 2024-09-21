import type { IOrderByMarkerEntity } from 'oneentry/dist/orders/ordersInterfaces';
import { useState } from 'react';

import { UsePrice } from '@/components/utils';

import OrderPage from './OrderPage';

const Order = ({ order }: { order: IOrderByMarkerEntity }) => {
  const { id, createdDate, currency, statusIdentifier, totalSum } = order;

  const formattedPrice = UsePrice({
    amount: totalSum,
    currency: currency,
  });
  const date = new Date(createdDate).toUTCString();
  const [state, setState] = useState(false);
  const rowClass = !state
    ? ' text-slate-700 hover:text-orange-500'
    : 'text-orange-500';

  return (
    <>
      <button
        // href={'/orders/' + id}
        onClick={() => {
          setState(!state);
        }}
        className={
          '-mb-px flex w-full gap-4 border-y p-4 text-left ' + rowClass
        }
      >
        <div className="w-1/2">{date}</div>
        <div className="w-1/4">{formattedPrice}</div>
        <div className="w-1/4">{statusIdentifier}</div>
      </button>
      {state && (
        <div className="p-4">
          <OrderPage id={Number(id)} />
        </div>
      )}
    </>
  );
};

export default Order;
