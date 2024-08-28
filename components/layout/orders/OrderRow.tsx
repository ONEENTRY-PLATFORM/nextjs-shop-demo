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
    // statusIdentifier
    totalSum,
  } = order;
  const formattedPrice = UsePrice({
    amount: totalSum,
    currency: currency,
  });

  return (
    <Link href={'/orders/' + id} className="flex gap-4">
      <div>{createdDate}</div>
      <div>{formattedPrice}</div>
    </Link>
  );
};

export default Order;
