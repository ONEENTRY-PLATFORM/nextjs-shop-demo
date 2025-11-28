import type { JSX } from 'react';
import { useContext, useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { AuthContext } from '@/app/store/providers/AuthContext';
import {
  selectDeliveryData,
  setDeliveryData,
} from '@/app/store/reducers/CartSlice';
import { addData } from '@/app/store/reducers/OrderSlice';

import TableRowAnimations from '../animations/TableRowAnimations';

/**
 * Address row component for the delivery information form
 * Allows user to input or edit their delivery address
 * Automatically populates with registered address if available
 * @param   {object}      props             - Component props
 * @param   {string}      props.placeholder - Placeholder text for the address input field
 * @returns {JSX.Element}                   Address row with input field and animations
 */
const AddressRow = ({ placeholder }: { placeholder: string }): JSX.Element => {
  /** Redux dispatch function for updating state */
  const dispatch = useAppDispatch();

  /** Get user data from authentication context */
  const { user } = useContext(AuthContext);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const deliveryData: any = useAppSelector(selectDeliveryData);

  /** Get registered address from user form data if available */
  const addressReg =
    user?.formData.find((el) => el.marker === 'address_reg')?.value || '';

  /**
   * Effect to synchronize address data between delivery data and order data
   * Updates the order address in Redux store when delivery data changes
   */
  useEffect(() => {
    /** Determine the address value to use (deliveryData.address, registered address, or empty string) */
    const address = deliveryData?.address || addressReg || '';

    /** Dispatch action to update order address data in Redux store */
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
    /* Wrap row with animation component for staggered entrance effects */
    <TableRowAnimations
      className="tr h-[50px] -mb-px border-y border-solid border-[#B0BCCE] max-md:max-w-full max-md:flex-wrap"
      index={7}
    >
      {/** Address label cell */}
      <div className="td w-3/12 items-center self-stretch text-sm">
        <label htmlFor={'address'}>{placeholder}</label>
      </div>

      {/** Address input field cell */}
      <div className="td w-8/12 px-5 text-base">
        <input
          size={40}
          type="text"
          value={deliveryData.address || addressReg || ''}
          id="address"
          name="address"
          placeholder={placeholder}
          onChange={(e) => {
            /** Update delivery data in Redux store when address changes */
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

      {/** Empty cell for layout spacing */}
      <div className="td w-1/12 pl-5 align-middle"></div>
    </TableRowAnimations>
  );
};

export default AddressRow;
