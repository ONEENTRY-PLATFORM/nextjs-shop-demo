/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import type { IOrderByMarkerEntity } from 'oneentry/dist/orders/ordersInterfaces';
import type { JSX, Key } from 'react';

import Loader from '@/components/shared/Loader';
import { UseDate, UsePrice } from '@/components/utils/utils';

interface IOrderField {
  marker: string;
  value: any;
}

interface ISettings {
  status_of_payment_title: { value: string };
  payment_account_title: { value: string };
  total_amount_title: { value: string };
  address_title: { value: string };
  delivery_date_title: { value: string };
  delivery_time_title: { value: string };
}

/**
 * OrderData table
 * @param   {object}               props          - Component props
 * @param   {ISettings}            props.settings - Settings object
 * @param   {IOrderByMarkerEntity} props.data     - Order data
 * @param   {string}               props.lang     - Current language
 * @returns {JSX.Element}                         JSX.Element
 */
const OrderDataTable = ({
  settings,
  data,
  lang,
}: {
  settings: ISettings;
  data: IOrderByMarkerEntity;
  lang: string;
}): JSX.Element => {
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
      <hr className="mb-4 text-slate-400" />
      {formData.map((field: IOrderField, i: Key) => {
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
            format: lang,
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
        return null;
      })}
      <div className="flex gap-2">
        <b>{status_of_payment_title.value}:</b> {statusIdentifier}
      </div>
      <div className="flex gap-2">
        <b>{payment_account_title.value}:</b>{' '}
        {paymentAccountLocalizeInfos?.title}
      </div>
      <div className="flex gap-2 text-lg">
        <b>{total_amount_title.value}: </b> {formattedTotal}
      </div>
      <hr className="my-4 text-slate-400" />
    </div>
  );
};

export default OrderDataTable;
