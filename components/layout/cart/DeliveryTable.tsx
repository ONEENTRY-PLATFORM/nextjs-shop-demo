/* eslint-disable @typescript-eslint/no-unused-vars */
import Image from 'next/image';
import type { IAttributes } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC, Key } from 'react';
import React, { useEffect } from 'react';

import { useGetFormByMarkerQuery } from '@/app/api';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  selectDeliveryData,
  setDeliveryData,
} from '@/app/store/reducers/CartSlice';
import { addData } from '@/app/store/reducers/OrderSlice';
import { UsePrice } from '@/components/utils';

import TableRow from './DeliveryTableRow';

const DeliveryTable: FC<{ delivery: IProductsEntity; lang: string }> = ({
  delivery,
  lang,
}) => {
  const dispatch = useAppDispatch();

  const { data } = useGetFormByMarkerQuery({
    marker: 'order',
    lang,
  });
  const attrs = data?.attributes.filter(
    (attr: IAttributes) => attr.marker !== 'time2',
  );
  const deliveryData = useAppSelector(selectDeliveryData);

  const {
    order_info_date_placeholder,
    order_info_time_placeholder,
    order_info_address_placeholder,
  } = useAppSelector((state) => state.systemContentReducer.content);

  // set delivery data onChange
  useEffect(() => {
    const date = deliveryData.date;
    const time = deliveryData.time;
    const address = deliveryData.address;

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
    <table className="table w-full border-collapse text-neutral-600">
      <tbody>
        {attrs?.map((attr: IAttributes, i: Key) => {
          const marker = attr.marker;

          if (marker === 'date') {
            return (
              <TableRow
                key={i}
                field={attr}
                label={'Date'}
                value={new Date(deliveryData.date).toLocaleDateString('en-US')}
                icon={'/icons/calendar.svg'}
                placeholder={order_info_date_placeholder.value}
              />
            );
          }
          if (marker === 'time') {
            return (
              <TableRow
                key={i}
                field={attr}
                label={'Time'}
                value={deliveryData.time}
                icon={'/icons/time.svg'}
                placeholder={order_info_time_placeholder.value}
              />
            );
          }
          if (marker === 'order_address') {
            return (
              <tr
                key={i}
                className="table-row h-[50px] gap-5 border-y border-solid border-[#B0BCCE] max-md:max-w-full max-md:flex-wrap"
              >
                <td className="self-stretch align-middle text-sm">
                  <label htmlFor={'address'}>
                    {order_info_address_placeholder.value}
                  </label>
                </td>
                <td className="px-5 align-middle text-base">
                  <input
                    size={40}
                    type="text"
                    value={deliveryData.address}
                    id="address"
                    name="address"
                    placeholder={order_info_address_placeholder.value}
                    onChange={(e) => {
                      dispatch(
                        setDeliveryData({
                          ...deliveryData,
                          address: e.target.value,
                        }),
                      );
                    }}
                    required
                  />
                </td>
              </tr>
            );
          }
          return;
        })}

        {delivery && (
          <tr className="table-row h-[50px] gap-5 border-b border-solid border-[#B0BCCE] max-md:max-w-full max-md:flex-wrap">
            <td className="table-cell align-middle">
              <Image
                loading="lazy"
                src="/icons/delivery.svg"
                alt="delivery"
                width={125}
                height={107}
                className="aspect-[1.16] w-[125px] max-w-full shrink-0 p-4 max-sm:p-2"
              />
            </td>
            <td className="table-cell px-5 align-middle">
              <div className="mt-2 flex flex-col self-start">
                <div className="mb-4 text-base max-sm:mb-2">
                  {delivery?.localizeInfos?.title}
                </div>
                <div className="mb-2 text-xl font-bold leading-8">
                  {UsePrice({
                    amount: delivery?.price,
                    currency: 'USD',
                  })}
                </div>
              </div>
            </td>
            <td className="table-cell pl-5 align-middle" />
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default DeliveryTable;
