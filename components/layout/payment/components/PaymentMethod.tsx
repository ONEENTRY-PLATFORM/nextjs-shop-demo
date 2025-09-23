import clsx from 'clsx';
import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IAccountsEntity } from 'oneentry/dist/payments/paymentsInterfaces';
import type { FC } from 'react';

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

type PaymentMethodProps = {
  account: IAccountsEntity;
  lang: string;
  dict: IAttributeValues;
  index: number;
};

/**
 * Payment method
 * @param account
 * @param lang current language shortcode
 * @param dict dictionary from server api
 * @param index Index of element for animations stagger
 *
 * @returns JSX.Element
 */
const PaymentMethod: FC<PaymentMethodProps> = ({
  account,
  lang,
  dict,
  index,
}) => {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  const dispatch = useAppDispatch();
  const { isLoading, onConfirmOrder } = useCreateOrder({ langCode });

  const orderData = useAppSelector((state) => state.orderReducer.order);
  const isActive = orderData?.paymentAccountIdentifier === account.identifier;

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

        <div id="cartData" className="w-full opacity-0">
          <div className="flex flex-wrap justify-between text-[#4C4D56]">
            <div className="flex w-2/3 flex-col border border-solid max-md:w-full max-md:max-w-full">
              <OrderProductsTable account={account} lang={lang} />
            </div>
            <div className="flex w-1/3 flex-col border border-solid px-6 py-2 max-md:w-full max-md:max-w-full max-md:border-t-0 max-md:px-2">
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
