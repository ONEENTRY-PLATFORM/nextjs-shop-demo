/* eslint-disable @next/next/no-html-link-for-pages */
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IAccountsEntity } from 'oneentry/dist/payments/paymentsInterfaces';
import type { JSX } from 'react';

import { useAppSelector } from '@/app/store/hooks';
import { UseDate } from '@/components/utils/utils';

/**
 * Order data table component.
 * Displays order information including delivery address, date, time and payment method.
 * Retrieves order data from the Redux store and formats it for display.
 * Shows a message with a link to the cart page if no order data is available.
 * @param   {object}           props         - Component properties
 * @param   {IAttributeValues} props.dict    - Dictionary data containing localized text values for UI elements
 * @param   {IAccountsEntity}  props.account - Account data containing payment method information
 * @returns {JSX.Element}                    Rendered order data table component
 * @example
 * <OrderDataTable
 *   dict={dictionaryValues}
 *   account={paymentAccount}
 * />
 */
const OrderDataTable = ({
  dict,
  account,
}: {
  dict: IAttributeValues;
  account: IAccountsEntity;
}): JSX.Element => {
  /**
   * Retrieve current order data from Redux store
   * The order data contains form fields with markers and values
   */
  const orderData = useAppSelector((state) => state.orderReducer.order);

  /** Extract localized text values from dictionary for consistent UI labeling */
  const {
    order_info_address_placeholder,
    delivery_date_text,
    delivery_time_text,
  } = dict;

  /**
   * Check if order data exists and has form data.
   * If no valid order data, display informational message with link to cart
   */
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
      {/** Section header for order information */}
      <div className="mb-4 font-bold">Order Information</div>

      {/** Map through order form data to display relevant fields */}
      {orderData.formData.map(
        (field: {
          marker: string;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          value: any;
        }) => {
          /** Display delivery address when marker matches */
          if (field.marker === 'order_address') {
            return (
              <div
                key={field.marker}
                className="flex flex-col max-md:flex-row max-md:gap-2"
              >
                <b>{order_info_address_placeholder?.value}:</b> {field.value}
              </div>
            );
          }

          /** Display formatted delivery date when marker matches. Uses UseDate utility to format the fullDate value */
          if (field.marker === 'date') {
            return (
              <div
                key={field.marker}
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

          /** Display delivery time when marker matches */
          if (field.marker === 'time') {
            return (
              <div
                key={field.marker}
                className="flex flex-col max-md:flex-row max-md:gap-2"
              >
                <b>{delivery_time_text?.value}: </b> {field.value}
              </div>
            );
          }

          /** Return null for unrecognized field markers */
          return null;
        },
      )}

      {/** Section header for payment method */}
      <div className="mt-4 font-bold">Payment Method</div>

      {/** Display payment method title from account localization info */}
      <div>{account?.localizeInfos?.title}</div>
    </>
  );
};

export default OrderDataTable;
