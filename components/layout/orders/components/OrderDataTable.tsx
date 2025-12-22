/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import type { IOrderByMarkerEntity } from 'oneentry/dist/orders/ordersInterfaces';
import type { JSX } from 'react';

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
 * Order data table component.
 * Displays detailed information about an order including address, delivery date/time, payment status, and total amount.
 * @param   {object}               props          - Component props
 * @param   {ISettings}            props.settings - Settings object containing localized titles for order fields
 * @param   {IOrderByMarkerEntity} props.data     - Order data to display
 * @param   {string}               props.lang     - Current language shortcode for formatting
 * @returns {JSX.Element}                         Order data table with formatted information
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
  /** Show loader if data or settings are not available */
  if (!data || !settings) {
    return <Loader />;
  }

  /** Extract relevant order data */
  const { formData, statusIdentifier, totalSum, paymentAccountLocalizeInfos } =
    data;

  /** Format the total amount using the UsePrice utility */
  const formattedTotal = UsePrice({
    amount: totalSum,
    lang,
  });

  /** Extract localized titles from settings */
  const {
    status_of_payment_title,
    payment_account_title,
    total_amount_title,
    address_title,
    delivery_date_title,
    delivery_time_title,
  } = settings;

  /** Render the order data table */
  return (
    <div className="flex flex-col gap-3">
      {/* Top divider line */}
      <hr className="mb-4 text-slate-400" />

      {/* Map through form data to display address, date, and time fields */}
      {formData.map((field: IOrderField) => {
        /** Display order address field */
        if (field.marker === 'order_address') {
          return (
            <div key={field.marker} className="flex gap-2">
              <b>{address_title.value}:</b> {field.value}
            </div>
          );
        }

        /** Display delivery date field with formatted date */
        if (field.marker === 'date') {
          const date = UseDate({
            fullDate: field.value.fullDate,
            format: lang,
          });

          return (
            <div key={field.marker} className="flex gap-2">
              <b>{delivery_date_title.value}: </b> {date}
            </div>
          );
        }

        /** Display delivery time field */
        if (field.marker === 'time') {
          return (
            <div key={field.marker} className="flex gap-2">
              <b>{delivery_time_title.value}: </b> {field.value}
            </div>
          );
        }

        /** Skip unrecognized fields */
        return null;
      })}

      {/* Display payment status */}
      <div className="flex gap-2">
        <b>{status_of_payment_title.value}:</b> {statusIdentifier}
      </div>

      {/* Display payment account information */}
      <div className="flex gap-2">
        <b>{payment_account_title.value}:</b>{' '}
        {paymentAccountLocalizeInfos?.title}
      </div>

      {/* Display formatted total amount with larger text */}
      <div className="flex gap-2 text-lg">
        <b>{total_amount_title.value}: </b> {formattedTotal}
      </div>

      {/* Bottom divider line */}
      <hr className="my-4 text-slate-400" />
    </div>
  );
};

export default OrderDataTable;
