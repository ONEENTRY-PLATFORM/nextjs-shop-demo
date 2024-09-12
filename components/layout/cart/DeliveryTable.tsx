import Image from 'next/image';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import React, { useState } from 'react';

import { useAppSelector } from '@/app/store/hooks';
import { UsePrice } from '@/components/utils';

import TableRow from './DeliveryTableRow';

const DeliveryTable: React.FC<IProductsEntity> = (product) => {
  const deliveryData = useAppSelector(
    (state) => state.cartReducer.deliveryData,
  );
  const date = new Date(deliveryData.date).toLocaleDateString('en-US');
  const {
    order_info_date_placeholder,
    order_info_time_placeholder,
    order_info_address_placeholder,
  } = useAppSelector((state) => state.systemContentReducer.content);

  const [address, setAddress] = useState('');

  return (
    <table className="table w-full border-collapse text-neutral-600">
      <tbody>
        <TableRow
          label={'Date'}
          value={date}
          icon={'/icons/calendar.svg'}
          placeholder={order_info_date_placeholder}
        />

        <TableRow
          label={'Time'}
          value={deliveryData?.time || ''}
          icon={'/icons/time.svg'}
          placeholder={order_info_time_placeholder}
        />

        <tr className="table-row h-[50px] gap-5 border-y border-solid border-[#B0BCCE] max-md:max-w-full max-md:flex-wrap">
          <td className="self-stretch align-middle text-sm">
            <label htmlFor={'address'}>Address</label>
          </td>
          <td className="px-5 align-middle text-base">
            <input
              size={40}
              type="text"
              value={address}
              id="address"
              name="address"
              placeholder={order_info_address_placeholder}
              onChange={(e) => setAddress(e.target.value)}
            />
          </td>
        </tr>

        {product && (
          <tr className="table-row h-[50px] gap-5 border-b border-solid border-[#B0BCCE] max-md:max-w-full max-md:flex-wrap">
            <td className="table-cell align-middle">
              <Image
                loading="lazy"
                src="/icons/delivery.svg"
                alt="delivery"
                width={125}
                height={107}
                className="aspect-[1.16] w-[125px] max-w-full shrink-0 p-4"
              />
            </td>
            <td className="table-cell px-5 align-middle">
              <div className="mt-2 flex flex-col self-start">
                <div className="text-base">{product?.localizeInfos?.title}</div>
                <div className="mt-4 text-xl font-bold leading-8">
                  {UsePrice({
                    amount: product?.price,
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
