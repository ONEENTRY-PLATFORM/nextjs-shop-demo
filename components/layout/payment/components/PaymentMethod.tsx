import clsx from 'clsx';
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IAccountsEntity } from 'oneentry/dist/payments/paymentsInterfaces';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { JSX } from 'react';

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
 * Payment method.
 * @param   {object}            props          - Account data and language.
 * @param   {object}            props.account  - Account data.
 * @param   {string}            props.lang     - current language shortcode.
 * @param   {IAttributeValues}  props.dict     - dictionary from server api.
 * @param   {number}            props.index    - Index of element for animations stagger.
 * @param   {IProductsEntity[]} props.products - Products data.
 * @param   {IProductsEntity}   props.delivery - Delivery data.
 * @returns {JSX.Element}                      JSX.Element.
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
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  const dispatch = useAppDispatch();
  const { isLoading, onConfirmOrder } = useCreateOrder({ langCode });

  const orderData = useAppSelector((state) => state.orderReducer.order);
  const isActive = orderData?.paymentAccountIdentifier === account.identifier;

  // Get cart data
  const cartData = useAppSelector((state) => state.cartReducer.productsData);
  const hasCartItems = cartData && cartData.some((item) => item.selected);

  return (
    <PaymentMethodAnimations
      className={
        'relative overflow-hidden w-full flex-row text-slate-700 items-center justify-between rounded-md border border-solid border-neutral-300 bg-transparent p-4 ' +
        clsx(isActive && 'min-h-36', ' min-h-10 cursor-pointer')
      }
      index={index}
      isActive={isActive}
    >
      <div
        onClick={() => {
          if (!isActive) {
            dispatch(addPaymentMethod(account.identifier));
          }
        }}
      >
        <div className={'flex-col'}>
          <h2 className="text-lg font-bold">{account?.localizeInfos?.title}</h2>
          <p className="mb-4 text-base">
            Payment description {account?.localizeInfos?.title}
          </p>
          <button
            onClick={() => {
              if (isActive) {
                dispatch(addPaymentMethod(''));
              }
            }}
            className="absolute bottom-4 right-4 size-6 rounded-full bg-slate-50 text-center"
          >
            {isActive ? '-' : '+'}
          </button>
        </div>

        <div id="cartData" className={`w-full ${isActive ? '' : 'hidden'}`}>
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
