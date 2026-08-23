'use client';

import type {
  IAttributeValues,
  IOrderByMarkerEntity,
  IOrdersFormData,
} from 'oneentry/types';
import type { JSX } from 'react';

import Loader from '@/components/shared/Loader';
import { UseDate, UsePrice } from '@/components/utils/utils';

/**
 * Order data table component.
 * Displays detailed information about an order including address, delivery date/time, payment status, and total amount.
 * Every settings read is guarded with an English fallback so an incomplete CMS block degrades instead of crashing.
 * @param   {object}               props          - Component props
 * @param   {IAttributeValues}     props.settings - Block attribute values containing localized titles for order fields
 * @param   {IOrderByMarkerEntity} props.data     - Order data to display
 * @param   {string}               props.lang     - Current language shortcode for formatting
 * @returns {JSX.Element}                         Order data table with formatted information
 */
const OrderDataTable = ({
  settings,
  data,
  lang,
}: {
  settings: IAttributeValues | undefined;
  data: IOrderByMarkerEntity;
  lang: string;
}): JSX.Element => {
  /** Show loader if data is not available */
  if (!data) {
    return <Loader />;
  }

  /** Extract relevant order data */
  const {
    formData,
    statusIdentifier,
    statusLocalizeInfos,
    totalSum,
    currency,
    paymentAccountIdentifier,
    paymentAccountLocalizeInfos,
  } = data;

  /** Format the total amount using the UsePrice utility */
  const formattedTotal = UsePrice({
    amount: totalSum,
    lang,
    currency,
  });

  /** Extract localized titles from settings — the CMS block may be incomplete */
  const {
    status_of_payment_title,
    payment_account_title,
    total_amount_title,
    address_title,
    delivery_date_title,
    delivery_time_title,
  } = settings ?? {};

  /** Render the order data table */
  return (
    <div className="flex flex-col gap-3">
      {/* Top divider line */}
      <hr className="mb-4 text-slate-400" />

      {/* Map through form data to display address, date, and time fields */}
      {formData?.map((field: IOrdersFormData) => {
        /** Display order address field */
        if (field.marker === 'order_address') {
          return (
            <div key={field.marker} className="flex gap-2">
              <b>{(address_title?.value as string) || 'Address'}:</b>{' '}
              {(field.value as string) || ''}
            </div>
          );
        }

        /** Display delivery date field with formatted date */
        if (field.marker === 'date') {
          /** A date field stored with a null/empty value has no fullDate — skip the row */
          const fullDate = (
            field.value as { fullDate?: string } | null | undefined
          )?.fullDate;
          if (!fullDate) {
            return null;
          }

          const date = UseDate({
            fullDate,
            format: lang,
          });

          return (
            <div key={field.marker} className="flex gap-2">
              <b>
                {(delivery_date_title?.value as string) || 'Delivery date'}
                :{' '}
              </b>{' '}
              {date}
            </div>
          );
        }

        /** Display delivery time field */
        if (field.marker === 'time') {
          return (
            <div key={field.marker} className="flex gap-2">
              <b>
                {(delivery_time_title?.value as string) || 'Delivery time'}
                :{' '}
              </b>{' '}
              {(field.value as string) || ''}
            </div>
          );
        }

        /** Skip unrecognized fields */
        return null;
      })}

      {/* Payment status — localized status title from the SDK, falling back to the raw marker */}
      <div className="flex gap-2">
        <b>
          {(status_of_payment_title?.value as string) || 'Status of payment'}:
        </b>{' '}
        {statusLocalizeInfos?.title || statusIdentifier || ''}
      </div>

      {/* Payment account information */}
      <div className="flex gap-2">
        <b>{(payment_account_title?.value as string) || 'Payment account'}:</b>{' '}
        {(paymentAccountLocalizeInfos?.title as string | undefined) ||
          paymentAccountIdentifier}
      </div>

      {/* Formatted total amount with larger text */}
      <div className="flex gap-2 text-lg">
        <b>{(total_amount_title?.value as string) || 'Total amount'}: </b>{' '}
        {formattedTotal}
      </div>

      {/* Bottom divider line */}
      <hr className="my-4 text-slate-400" />
    </div>
  );
};

export default OrderDataTable;
