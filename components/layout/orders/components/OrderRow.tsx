import type { IOrderByMarkerEntity } from 'oneentry/dist/orders/ordersInterfaces';
import type { FC } from 'react';
import { useState } from 'react';

import { UsePrice } from '@/components/utils';

import OrderPage from './OrderPage';

interface OrderProps {
  order: IOrderByMarkerEntity;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  settings: Record<string, any> | undefined;
  lang: string;
}

const Order: FC<OrderProps> = ({ order, settings, lang }) => {
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
    <>
      <button
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
          <OrderPage id={Number(id)} settings={settings} lang={lang} />
        </div>
      )}
    </>
  );
};

export default Order;
