import type { IAttributes } from 'oneentry/dist/base/utils';
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { JSX, Key } from 'react';
import { useContext, useEffect } from 'react';

import { useGetFormByMarkerQuery } from '@/app/api';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { AuthContext } from '@/app/store/providers/AuthContext';
import { selectDeliveryData } from '@/app/store/reducers/CartSlice';
import { addData } from '@/app/store/reducers/OrderSlice';

import TableRowAnimations from '../animations/TableRowAnimations';
import AddressRow from './AddressRow';
import DeliveryRow from './DeliveryRow';
import DeliveryTableRow from './DeliveryTableRow';

/**
 * Delivery table component that displays delivery information form
 * Contains date, time, address fields and delivery option details
 * Manages synchronization of delivery data with order data in Redux store
 * @param   {object}           props          - DeliveryTable props
 * @param   {IProductsEntity}  props.delivery - Represents a product entity object with delivery information
 * @param   {string}           props.lang     - Current language shortcode for localization
 * @param   {IAttributeValues} props.dict     - Dictionary with localized values from server API
 * @returns {JSX.Element}                     Delivery table with form fields and delivery information
 */
const DeliveryTable = ({
  delivery,
  lang,
  dict,
}: {
  delivery: IProductsEntity;
  lang: string;
  dict: IAttributeValues;
}): JSX.Element => {
  /** Redux dispatch function for updating state */
  const dispatch = useAppDispatch();

  /** Get user data from authentication context */
  const { user } = useContext(AuthContext);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const deliveryData: any = useAppSelector(selectDeliveryData);

  /** Fetch order form data by marker using RTK Query */
  const { data } = useGetFormByMarkerQuery({
    marker: 'order',
    lang,
  });

  /** Extract localized placeholders from dictionary */
  const {
    order_info_date_placeholder,
    order_info_time_placeholder,
    order_info_address_placeholder,
  } = dict;

  /** Filter form attributes to exclude 'time2' marker */
  const attrs = data?.attributes;

  /** Get registered address from user form data if available */
  const addressReg =
    user?.formData.find((el) => el.marker === 'address_reg')?.value || '';

  /**
   * Effect to synchronize delivery data with order data in Redux store
   * Updates date, time, and address information when delivery data changes
   */
  useEffect(() => {
    /** Exit early if no delivery data is available */
    if (!deliveryData) {
      return;
    }

    /** Extract individual data fields */
    const date = deliveryData.date;
    const time = deliveryData.time;
    const address = deliveryData.address || addressReg || '';

    /** Dispatch action to update date information in order data */
    dispatch(
      addData({
        marker: 'date',
        type: 'date',
        value: {
          fullDate: new Date(date).toISOString(),
          formattedValue: new Date(date).toDateString() + ' 00:00',
          formatString: 'YYYY-MM-DD',
        },
        valid: date ? true : false,
      }),
    );

    /** Dispatch action to update time information in order data */
    dispatch(
      addData({
        marker: 'time',
        type: 'string',
        value: time,
        valid: time ? true : false,
      }),
    );

    /** Dispatch action to update address information in order data */
    dispatch(
      addData({
        marker: 'order_address',
        type: 'string',
        value: address,
        valid: address ? true : false,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deliveryData]);

  return (
    /** Wrap table with animation component for staggered entrance effects */
    <TableRowAnimations
      className="table w-full border-collapse text-neutral-600"
      index={5}
    >
      <div>
        {/** Map through form attributes to render appropriate form rows */}
        {attrs?.map((attr: IAttributes, i: Key) => {
          const marker = attr.marker;

          /** Render date row with calendar icon */
          if (marker === 'date') {
            return (
              <DeliveryTableRow
                key={i}
                value={new Date(deliveryData.date).toLocaleDateString('en-US')}
                icon={'/icons/calendar.svg'}
                label={order_info_date_placeholder?.value}
                placeholder={order_info_date_placeholder?.value}
              />
            );
          }

          /** Render time row with clock icon */
          if (marker === 'time') {
            return (
              <DeliveryTableRow
                key={i}
                value={deliveryData.time}
                icon={'/icons/time.svg'}
                label={order_info_time_placeholder?.value}
                placeholder={order_info_time_placeholder?.value}
              />
            );
          }

          /** Render address row with input field */
          if (marker === 'order_address') {
            return (
              <AddressRow
                key={i}
                placeholder={order_info_address_placeholder?.value}
              />
            );
          }

          /** Return nothing for unhandled markers */
          return;
        })}

        {/** Render delivery information row with price */}
        <DeliveryRow lang={lang} delivery={delivery} />
      </div>
    </TableRowAnimations>
  );
};

export default DeliveryTable;
