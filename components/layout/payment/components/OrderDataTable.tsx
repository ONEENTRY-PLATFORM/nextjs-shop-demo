/* eslint-disable @next/next/no-html-link-for-pages */
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IAccountsEntity } from 'oneentry/dist/payments/paymentsInterfaces';
import type { JSX, Key } from 'react';

import { useAppSelector } from '@/app/store/hooks';
import { UseDate } from '@/components/utils/utils';

/**
 * Order data table.
 * @param   {object}           props         - Component properties.
 * @param   {IAttributeValues} props.dict    - Dictionary data.
 * @param   {IAccountsEntity}  props.account - Account data.
 * @returns {JSX.Element}                    JSX.Element.
 */
const OrderDataTable = ({
  dict,
  account,
}: {
  dict: IAttributeValues;
  account: IAccountsEntity;
}): JSX.Element => {
  const orderData = useAppSelector((state) => state.orderReducer.order);
  const {
    order_info_address_placeholder,
    delivery_date_text,
    delivery_time_text,
  } = dict;

  // If no order data, show a message
  if (!orderData || !orderData.formData || orderData.formData.length === 0) {
    return (
      <div className="p-4 text-center">
        No order data available, go to{' '}
        <a href="/cart/" className="text-orange-500">
          cart page
        </a>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 font-bold">Order Information</div>
      {orderData.formData.map(
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
              <div
                key={i}
                className="flex flex-col max-md:flex-row max-md:gap-2"
              >
                <b>{order_info_address_placeholder?.value}:</b> {field.value}
              </div>
            );
          }
          if (field.marker === 'date') {
            return (
              <div
                key={i}
                className="flex flex-col max-md:flex-row max-md:gap-2"
              >
                <b>{delivery_date_text?.value}: </b>{' '}
                {UseDate({
                  fullDate: field.value.fullDate,
                  format: 'en',
                })}
              </div>
            );
          }
          if (field.marker === 'time') {
            return (
              <div
                key={i}
                className="flex flex-col max-md:flex-row max-md:gap-2"
              >
                <b>{delivery_time_text?.value}: </b> {field.value}
              </div>
            );
          }
          return null;
        },
      )}
      <div className="mt-4 font-bold">Payment Method</div>
      <div>{account?.localizeInfos?.title}</div>
    </>
  );
};

export default OrderDataTable;
