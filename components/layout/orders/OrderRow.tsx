import Link from 'next/link';
import type { IOrdersByMarkersEntity } from 'oneentry/dist/orders/ordersInterfaces';

import { UsePrice } from '@/components/utils';

const Order = ({ order }: { order: IOrdersByMarkersEntity }) => {
  const {
    id,
    createdDate,
    currency,
    // paymentAccountLocalizeInfos,
    // products,
    // statusIdentifier,
    // attributeSetIdentifier
    // formData
    // formIdentifier
    // isHistory
    // paymentAccountIdentifier
    statusIdentifier,
    totalSum,
  } = order;
  const formattedPrice = UsePrice({
    amount: totalSum,
    currency: currency,
  });

  return (
    <Link
      href={'/orders/' + id}
      className="-mb-px flex border-collapse gap-4 border-y p-4 hover:text-orange-500"
    >
      <div className="w-1/2">{createdDate}</div>
      <div className="w-1/4">{formattedPrice}</div>
      <div className="w-1/4">{statusIdentifier}</div>
    </Link>
  );
};

export default Order;
