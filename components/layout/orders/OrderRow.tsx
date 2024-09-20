import Link from 'next/link';
import type { IOrderByMarkerEntity } from 'oneentry/dist/orders/ordersInterfaces';

import { UsePrice } from '@/components/utils';

const Order = ({ order }: { order: IOrderByMarkerEntity }) => {
  const { id, createdDate, currency, statusIdentifier, totalSum } = order;

  const formattedPrice = UsePrice({
    amount: totalSum,
    currency: currency,
  });
  const date = new Date(createdDate).toUTCString();

  return (
    <Link
      href={'/orders/' + id}
      className="-mb-px flex border-collapse gap-4 border-y p-4 text-slate-700 hover:text-orange-500"
    >
      <div className="w-1/2">{date}</div>
      <div className="w-1/4">{formattedPrice}</div>
      <div className="w-1/4">{statusIdentifier}</div>
    </Link>
  );
};

export default Order;
