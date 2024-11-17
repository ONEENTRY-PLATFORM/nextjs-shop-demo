import type { IAccountsEntity } from 'oneentry/dist/payments/paymentsInterfaces';
import type { FC, Key } from 'react';

import { useAppSelector } from '@/app/store/hooks';
import { UseDate } from '@/components/utils';

type OrderDataTableProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
  account: IAccountsEntity;
};

/**
 * Order data table
 * @param dict
 * @param account
 *
 * @returns JSX.Element
 */
const OrderDataTable: FC<OrderDataTableProps> = ({ dict }) => {
  const orderData = useAppSelector((state) => state.orderReducer.order);
  const {
    order_info_address_placeholder,
    delivery_date_text,
    delivery_time_text,
  } = dict;

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
            <b>{order_info_address_placeholder.value}:</b> {field.value}
          </div>
        );
      }
      if (field.marker === 'date') {
        return (
          <div key={i} className="flex flex-col max-md:flex-row max-md:gap-2">
            <b>{delivery_date_text.value}: </b>{' '}
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
            <b>{delivery_time_text.value}: </b> {field.value}
          </div>
        );
      }
      return;
    },
  );
};

export default OrderDataTable;
