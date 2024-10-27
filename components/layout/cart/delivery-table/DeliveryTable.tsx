import Image from 'next/image';
import type { IAttributes } from 'oneentry/dist/base/utils';
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC, Key } from 'react';
import React, { useContext, useEffect } from 'react';

import { useGetFormByMarkerQuery } from '@/app/api';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { AuthContext } from '@/app/store/providers/AuthContext';
import {
  selectDeliveryData,
  setDeliveryData,
} from '@/app/store/reducers/CartSlice';
import { addData } from '@/app/store/reducers/OrderSlice';
import { UsePrice } from '@/components/utils';

import TableRow from './DeliveryTableRow';

const DeliveryTable: FC<{
  delivery: IProductsEntity;
  lang: string;
  dict: IAttributeValues;
}> = ({ delivery, lang, dict }) => {
  const dispatch = useAppDispatch();
  const { data } = useGetFormByMarkerQuery({
    marker: 'order',
    lang,
  });
  const { user } = useContext(AuthContext);

  const attrs = data?.attributes.filter(
    (attr: IAttributes) => attr.marker !== 'time2',
  );
  const deliveryData = useAppSelector(selectDeliveryData);
  const addressReg =
    user?.formData.find((el) => el.marker === 'address_reg')?.value || '';

  const {
    order_info_date_placeholder,
    order_info_time_placeholder,
    order_info_address_placeholder,
  } = dict;

  // set delivery data onChange
  useEffect(() => {
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
    <div className="table w-full border-collapse text-neutral-600">
      <div>
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
                placeholder={order_info_date_placeholder?.value}
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
                placeholder={order_info_time_placeholder?.value}
              />
            );
          }
          if (marker === 'order_address') {
            return (
              <div
                key={i}
                className="tr h-[50px] border-y border-solid border-[#B0BCCE] max-md:max-w-full max-md:flex-wrap"
              >
                <div className="td w-3/12 items-center self-stretch text-sm">
                  <label htmlFor={'address'}>
                    {order_info_address_placeholder?.value}
                  </label>
                </div>
                <div className="td w-8/12 px-5 text-base">
                  <input
                    size={40}
                    type="text"
                    value={deliveryData.address || addressReg || ''}
                    id="address"
                    name="address"
                    placeholder={order_info_address_placeholder?.value}
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
                </div>
                <div className="td w-1/12 pl-5 align-middle"></div>
              </div>
            );
          }
          return;
        })}

        <div className="tr h-[100px] border-b border-solid border-[#B0BCCE] max-md:max-w-full max-md:flex-wrap">
          <div className="td w-3/12 align-middle">
            <Image
              loading="lazy"
              src="/icons/delivery.svg"
              alt="delivery"
              width={125}
              height={107}
              className="aspect-[1.16] w-[125px] max-w-full shrink-0 p-4 max-sm:p-2"
            />
          </div>
          <div className="td w-8/12 px-5 align-middle">
            <div className="mt-2 flex flex-col self-start">
              <div className="mb-4 text-base max-sm:mb-2">
                {delivery?.localizeInfos?.title}
              </div>
              <div className="mb-2 text-xl font-bold leading-8">
                {UsePrice({
                  amount: delivery?.price,
                  lang,
                })}
              </div>
            </div>
          </div>
          <div className="td w-1/12 pl-5 align-middle" />
        </div>
      </div>
    </div>
  );
};

export default DeliveryTable;
