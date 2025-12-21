import clsx from 'clsx';
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IAccountsEntity } from 'oneentry/dist/payments/paymentsInterfaces';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { JSX } from 'react';
import { useCallback, useMemo } from 'react';

import { useCreateOrder } from '@/app/api/hooks/useCreateOrder';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { addPaymentMethod } from '@/app/store/reducers/OrderSlice';
import { LanguageEnum } from '@/app/types/enum';

import TotalAmount from '../../cart/components/TotalAmount';
import PaymentMethodAnimations from '../animations/PaymentMethodAnimations';
import ConfirmOrderButton from './ConfirmOrderButton';
import EditOrderButton from './EditOrderButton';
import OrderDataTable from './OrderDataTable';
import OrderProductsTable from './OrderProductsTable';

/**
 * Payment method component.
 * Displays a payment method option with associated order information and actions.
 * Handles selection of payment methods and displays relevant cart data when selected.
 * Integrates with order creation functionality and provides options to confirm or edit orders.
 * @param   {object}            props          - Component properties.
 * @param   {object}            props.account  - Account data containing payment method information.
 * @param   {string}            props.lang     - Current language shortcode for localization.
 * @param   {IAttributeValues}  props.dict     - Dictionary from server API containing localized text values.
 * @param   {number}            props.index    - Index of element for animations stagger effect.
 * @param   {IProductsEntity[]} props.products - Products data to display in order table (optional).
 * @param   {IProductsEntity}   props.delivery - Delivery data to display in order table (optional).
 * @returns {JSX.Element}                      Payment method component.
 */
const PaymentMethod = ({
  account,
  lang,
  dict,
  index,
  products,
  delivery,
}: {
  account: IAccountsEntity;
  lang: string;
  dict: IAttributeValues;
  index: number;
  products?: IProductsEntity[];
  delivery?: IProductsEntity;
}): JSX.Element => {
  /** Map language code to enum value for API calls */
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];

  /** Redux dispatch function for state updates */
  const dispatch = useAppDispatch();

  /** Order creation hook with loading state and confirmation function */
  const { isLoading, onConfirmOrder } = useCreateOrder({ langCode });

  /** Retrieve current order data from Redux store */
  const orderData = useAppSelector((state) => state.orderReducer.order);

  /** Check if this payment method is currently active/selected */
  const isActive = orderData?.paymentAccountIdentifier === account.identifier;

  /** Get cart data from Redux store */
  const cartData = useAppSelector((state) => state.cartReducer.productsData);

  /** Check if there are any selected items in the cart (memoized) */
  const hasCartItems = useMemo(
    () => cartData && cartData.some((item) => item.selected),
    [cartData],
  );

  /**
   * Toggle payment method selection
   * Opens the method if it's not active, closes it if it is active
   */
  const handleToggleMethod = useCallback(() => {
    if (isActive) {
      dispatch(addPaymentMethod(''));
    } else {
      dispatch(addPaymentMethod(account.identifier));
    }
  }, [isActive, dispatch, account.identifier]);

  /**
   * Memoized container className
   */
  const containerClassName = useMemo(
    () =>
      'relative overflow-hidden w-full flex-row text-slate-700 items-center justify-between rounded-md border border-solid border-neutral-300 bg-transparent p-4 ' +
      clsx(isActive && 'min-h-36', ' min-h-10 cursor-pointer'),
    [isActive],
  );

  return (
    <PaymentMethodAnimations
      className={containerClassName}
      index={index}
      isActive={isActive}
      onClick={handleToggleMethod}
    >
      <div>
        <div className={'flex-col'}>
          <h2 className="text-lg font-bold">{account?.localizeInfos?.title}</h2>
          <p className="mb-4 text-base">
            Payment description {account?.localizeInfos?.title}
          </p>
          <button
            className="absolute cursor-pointer bottom-4 right-4 size-6 rounded-full bg-slate-50 text-center"
            aria-label={
              isActive ? 'Collapse payment method' : 'Expand payment method'
            }
          >
            {isActive ? '-' : '+'}
          </button>
        </div>

        <div
          id="cartData"
          className={`w-full ${isActive ? '' : 'hidden'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-wrap justify-between text-[#4C4D56]">
            <div className="flex w-2/3 min-h-full justify-between flex-col border border-r-0 border-b-0 border-solid border-[#B0BCCE] max-md:w-full max-md:max-w-full">
              {hasCartItems ? (
                <OrderProductsTable
                  lang={lang}
                  products={products}
                  delivery={delivery}
                />
              ) : (
                <div className="p-4">No items in cart</div>
              )}
            </div>
            <div className="flex w-1/3 flex-col border border-solid border-[#B0BCCE] px-6 py-2 max-md:w-full max-md:max-w-full max-md:border-t-0 max-md:px-2">
              <OrderDataTable dict={dict} account={account} />
            </div>
            <div className="mt-2 flex">
              <TotalAmount
                className={
                  'text-base font-bold leading-8 text-neutral-600 lg:self-end'
                }
                lang={lang}
                dict={dict}
              />
            </div>
          </div>
          <div className="flex gap-4 max-md:mb-8 max-sm:flex-col-reverse max-sm:flex-wrap max-sm:gap-0">
            <ConfirmOrderButton
              dict={dict}
              account={account}
              isLoading={isLoading}
              onConfirmOrder={onConfirmOrder}
            />
            <EditOrderButton dict={dict} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </PaymentMethodAnimations>
  );
};

export default PaymentMethod;
