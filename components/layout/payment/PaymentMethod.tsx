import clsx from 'clsx';
import type { IAccountsEntity } from 'oneentry/dist/payments/paymentsInterfaces';
import type { FC, Key } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { addPaymentMethod } from '@/app/store/reducers/OrderSlice';
import { UseDate } from '@/components/utils';

import TotalAmount from '../cart/TotalAmount';

type Props = {
  account: IAccountsEntity;
  onConfirmOrder: () => Promise<void> | undefined;
  onEditOrder: () => Promise<void> | undefined;
};

const PaymentMethod: FC<Props> = ({ account, onConfirmOrder, onEditOrder }) => {
  const dispatch = useAppDispatch();

  const orderData = useAppSelector((state) => state.orderReducer.order);
  const productsInCart = useAppSelector((state) => state.cartReducer.products);
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
            <div className="flex w-2/3 flex-col border border-solid max-md:max-w-full">
              <div className="flex border-b border-solid p-2">
                <div className="w-1/2 font-bold">Product</div>
                <div className="w-1/4 font-bold">Price</div>
                <div className="w-1/4 font-bold">Quantity</div>
              </div>
              {productsInCart.map((product, i) => {
                const { localizeInfos, selected, quantity, price } = product;
                const title = localizeInfos?.title;
                if (!selected) {
                  return;
                }
                return (
                  <div
                    key={i}
                    className="-mt-px flex border-b border-solid p-2"
                  >
                    <div className="w-1/2">{title}</div>
                    <div className="w-1/4">{price}</div>
                    <div className="w-1/4">{quantity}</div>
                  </div>
                );
              })}
            </div>
            <div className="flex w-1/3 flex-col border border-solid px-6 py-2 max-md:max-w-full">
              {orderData?.formData.map(
                (
                  field: {
                    marker: string;
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    value: any;
                  },
                  i: Key,
                ) => {
                  if (field.marker === 'order_address') {
                    return (
                      <div key={i} className="flex flex-col">
                        <b>Address:</b> {field.value}
                      </div>
                    );
                  }
                  if (field.marker === 'date') {
                    return (
                      <div key={i} className="flex flex-col">
                        <b>Delivery date: </b>{' '}
                        {UseDate({
                          fullDate: field.value.fullDate,
                          format: 'en',
                        })}
                      </div>
                    );
                  }
                  if (field.marker === 'time') {
                    return (
                      <div key={i} className="flex flex-col">
                        <b>Delivery time: </b> {field.value}
                      </div>
                    );
                  }
                  return;
                },
              )}
            </div>
            <div className="mt-2 flex">
              <TotalAmount
                className={
                  'text-base font-bold leading-8 text-neutral-600 lg:self-end'
                }
              />
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => onConfirmOrder()}
              className="btn btn-o btn-sm btn-o-primary mt-5 px-12"
            >
              Apply
            </button>
            <button
              onClick={() => onEditOrder()}
              className="btn btn-o btn-sm btn-o-primary mt-5 px-12"
            >
              Edit
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentMethod;
