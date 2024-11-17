import type { FC } from 'react';
import React, { useContext, useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { AuthContext } from '@/app/store/providers/AuthContext';
import {
  selectDeliveryData,
  setDeliveryData,
} from '@/app/store/reducers/CartSlice';
import { addData } from '@/app/store/reducers/OrderSlice';

import TableRowAnimations from '../animations/TableRowAnimations';

/**
 * Address row
 * @param placeholder
 *
 * @returns
 */
const AddressRow: FC<{ placeholder: string }> = ({ placeholder }) => {
  const dispatch = useAppDispatch();
  const { user } = useContext(AuthContext);
  const deliveryData = useAppSelector(selectDeliveryData);

  // get address from user formData
  const addressReg =
    user?.formData.find((el) => el.marker === 'address_reg')?.value || '';

  // set address on change deliveryData
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
    <TableRowAnimations
      className="tr h-[50px] border-y border-solid border-[#B0BCCE] max-md:max-w-full max-md:flex-wrap"
      index={7}
    >
      <div className="td w-3/12 items-center self-stretch text-sm">
        <label htmlFor={'address'}>{placeholder}</label>
      </div>
      <div className="td w-8/12 px-5 text-base">
        <input
          size={40}
          type="text"
          value={deliveryData.address || addressReg || ''}
          id="address"
          name="address"
          placeholder={placeholder}
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
    </TableRowAnimations>
  );
};

export default AddressRow;
