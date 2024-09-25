import clsx from 'clsx';
import type { IAccountsEntity } from 'oneentry/dist/payments/paymentsInterfaces';
import type { FC } from 'react';

import { useCreateOrder } from '@/app/api/hooks/useCreateOrder';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { addPaymentMethod } from '@/app/store/reducers/OrderSlice';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Loader from '@/components/shared/Loader';

import TotalAmount from '../cart/TotalAmount';
import ConfirmOrderButton from './ConfirmOrderButton';
import EditOrderButton from './EditOrderButton';
import OrderDataTable from './OrderDataTable';
import OrderProductsTable from './OrderProductsTable';

type PaymentMethodProps = {
  account: IAccountsEntity;
};

const PaymentMethod: FC<PaymentMethodProps> = ({ account }) => {
  const dispatch = useAppDispatch();
  const { isLoading, onConfirmOrder } = useCreateOrder();

  const orderData = useAppSelector((state) => state.orderReducer.order);
  const isActive = orderData?.paymentAccountIdentifier === account.identifier;

  return (
    <div
      onClick={() => {
        if (!isActive) {
          dispatch(addPaymentMethod(account.identifier));
        }
      }}
      className={
        'relative w-full flex-row text-slate-700 items-center justify-between rounded-md border border-solid border-neutral-300 bg-transparent p-4 cursor-pointer ' +
        clsx(isActive && 'min-h-36', ' min-h-10')
      }
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

      {isActive && (
        <>
          <div className="flex flex-wrap justify-between text-[#4C4D56]">
            <div className="flex w-2/3 flex-col border border-solid max-md:w-full max-md:max-w-full">
              <OrderProductsTable account={account} />
            </div>
            <div className="flex w-1/3 flex-col border border-solid px-6 py-2 max-md:w-full max-md:max-w-full max-md:border-t-0 max-md:px-2">
              <OrderDataTable account={account} />
            </div>
            <div className="mt-2 flex">
              <TotalAmount
                className={
                  'text-base font-bold leading-8 text-neutral-600 lg:self-end'
                }
              />
            </div>
          </div>
          <div className="flex gap-4 max-md:mb-8 max-sm:flex-col-reverse max-sm:flex-wrap max-sm:gap-0">
            <ConfirmOrderButton
              account={account}
              isLoading={isLoading}
              onConfirmOrder={onConfirmOrder}
            />
            <EditOrderButton isLoading={isLoading} />
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentMethod;
