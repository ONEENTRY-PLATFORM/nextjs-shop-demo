import type { IAttributes } from 'oneentry/dist/base/utils';
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { JSX, Key } from 'react';
import React, { useContext, useEffect } from 'react';

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
 * Delivery table.
 * @param   {object}           props          - DeliveryTable props.
 * @param   {IProductsEntity}  props.delivery - Represents a product entity object.
 * @param   {string}           props.lang     - Current language shortcode.
 * @param   {IAttributeValues} props.dict     - dictionary from server api.
 * @returns {JSX.Element}                     JSX.Element
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
  const dispatch = useAppDispatch();
  const { user } = useContext(AuthContext);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const deliveryData: any = useAppSelector(selectDeliveryData);

  // get form by marker with RTK
  const { data } = useGetFormByMarkerQuery({
    marker: 'order',
    lang,
  });

  const {
    order_info_date_placeholder,
    order_info_time_placeholder,
    order_info_address_placeholder,
  } = dict;

  const attrs = data?.attributes.filter(
    (attr: IAttributes) => attr.marker !== 'time2',
  );
  const addressReg =
    user?.formData.find((el) => el.marker === 'address_reg')?.value || '';

  // set delivery data onChange
  useEffect(() => {
    if (!deliveryData) {
      return;
    }
    const date = deliveryData.date;
    const time = deliveryData.time;
    const address = deliveryData.address || addressReg || '';

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
    dispatch(
      addData({
        marker: 'time',
        type: 'string',
        value: time,
        valid: time ? true : false,
      }),
    );
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
    <TableRowAnimations
      className="table w-full border-collapse text-neutral-600"
      index={5}
    >
      <div>
        {attrs?.map((attr: IAttributes, i: Key) => {
          const marker = attr.marker;
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
          if (marker === 'order_address') {
            return (
              <AddressRow
                key={i}
                placeholder={order_info_address_placeholder?.value}
              />
            );
          }
          return;
        })}
        <DeliveryRow lang={lang} delivery={delivery} />
      </div>
    </TableRowAnimations>
  );
};

export default DeliveryTable;
