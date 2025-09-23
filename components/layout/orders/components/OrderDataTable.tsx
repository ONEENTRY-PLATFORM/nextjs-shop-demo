/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import type { FC, Key } from 'react';

import Loader from '@/components/shared/Loader';
import { UseDate, UsePrice } from '@/components/utils';

/**
 * OrderData table
 * @param settings
 * @param data
 * @param lang current language shortcode
 *
 * @returns JSX.Element
 */
const OrderDataTable: FC<{
  settings: Record<string, any> | undefined;
  data: Record<string, any> | undefined;
  lang: string;
}> = ({ settings, data, lang }) => {
  if (!data || !settings) {
    return <Loader />;
  }

  const { formData, statusIdentifier, totalSum, paymentAccountLocalizeInfos } =
    data;

  const formattedTotal = UsePrice({
    amount: totalSum,
    lang,
  });

  const {
    status_of_payment_title,
    payment_account_title,
    total_amount_title,
    address_title,
    delivery_date_title,
    delivery_time_title,
  } = settings;

  return (
    <div className="flex flex-col gap-3">
      <hr className="mb-4" />
      {formData.map(
        (
          field: {
            marker: string;
            value: any;
          },
          i: Key,
        ) => {
          if (field.marker === 'order_address') {
            return (
              <div key={i} className="flex gap-2">
                <b>{address_title.value}:</b> {field.value}
              </div>
            );
          }
          if (field.marker === 'date') {
            const date = UseDate({
              fullDate: field.value.fullDate,
              format: 'en',
            });

            return (
              <div key={i} className="flex gap-2">
                <b>{delivery_date_title.value}: </b> {date}
              </div>
            );
          }
          if (field.marker === 'time') {
            return (
              <div key={i} className="flex gap-2">
                <b>{delivery_time_title.value}: </b> {field.value}
              </div>
            );
          }
          return;
        },
      )}
      <div className="flex gap-2">
        <b>{status_of_payment_title.value}:</b> {statusIdentifier}
      </div>
      <div className="flex gap-2">
        <div>
          <b>{payment_account_title.value}:</b>{' '}
          {paymentAccountLocalizeInfos.title}
        </div>
      </div>
      <div className="flex gap-2 text-lg">
        <b>{total_amount_title.value}: </b> {formattedTotal}
      </div>
      <hr className="my-4" />
    </div>
  );
};

export default OrderDataTable;
