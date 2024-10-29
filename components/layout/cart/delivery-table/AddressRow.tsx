import type { IAttributes } from 'oneentry/dist/base/utils';
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';
import React, { useContext, useEffect } from 'react';

import { useGetFormByMarkerQuery } from '@/app/api';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { AuthContext } from '@/app/store/providers/AuthContext';
import {
  selectDeliveryData,
  setDeliveryData,
} from '@/app/store/reducers/CartSlice';
import { addData } from '@/app/store/reducers/OrderSlice';

const DeliveryTable: FC<{ dict: IAttributeValues }> = ({ dict }) => {
  const dispatch = useAppDispatch();
  const { user } = useContext(AuthContext);
  const deliveryData = useAppSelector(selectDeliveryData);

  const { order_info_address_placeholder } = dict;

  const addressReg =
    user?.formData.find((el) => el.marker === 'address_reg')?.value || '';

  // set address onChange
  useEffect(() => {
    const address = deliveryData.address || addressReg || '';
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
    <div className="tr h-[50px] border-y border-solid border-[#B0BCCE] max-md:max-w-full max-md:flex-wrap">
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
};

export default DeliveryTable;
