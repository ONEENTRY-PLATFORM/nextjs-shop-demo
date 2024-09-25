import type { IAccountsEntity } from 'oneentry/dist/payments/paymentsInterfaces';
import type { FC, Key } from 'react';

import { useAppSelector } from '@/app/store/hooks';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Loader from '@/components/shared/Loader';
import { UseDate } from '@/components/utils';

type OrderDataTableProps = {
  account: IAccountsEntity;
};

const OrderDataTable: FC<OrderDataTableProps> = () => {
  const orderData = useAppSelector((state) => state.orderReducer.order);

  return orderData?.formData.map(
    (
      field: {
        marker: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        value: any;
      },
      i: Key,
    ) => {
      if (field.marker === 'order_address') {
        return (
          <div key={i} className="flex flex-col max-md:flex-row max-md:gap-2">
            <b>Address:</b> {field.value}
          </div>
        );
      }
      if (field.marker === 'date') {
        return (
          <div key={i} className="flex flex-col max-md:flex-row max-md:gap-2">
            <b>Delivery date: </b>{' '}
            {UseDate({
              fullDate: field.value.fullDate,
              format: 'en',
            })}
          </div>
        );
      }
      if (field.marker === 'time') {
        return (
          <div key={i} className="flex flex-col max-md:flex-row max-md:gap-2">
            <b>Delivery time: </b> {field.value}
          </div>
        );
      }
      return;
    },
  );
};

export default OrderDataTable;
