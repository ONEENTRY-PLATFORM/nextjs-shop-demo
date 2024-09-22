import type { IAccountsEntity } from 'oneentry/dist/payments/paymentsInterfaces';
import type { FC, Key } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { addPaymentMethod } from '@/app/store/reducers/OrderSlice';
import { UseDate } from '@/components/utils';

type Props = {
  account: IAccountsEntity;
  onConfirmOrder: () => Promise<void> | undefined;
};

const PaymentMethod: FC<Props> = ({ account, onConfirmOrder }) => {
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
        (isActive ? 'min-h-36' : ' min-h-10')
      }
    >
      <div className={'flex-col'}>
        <h1 className="text-lg">{account?.localizeInfos?.title}</h1>
        <p className="text-md mb-4">
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
          <div className="flex flex-col text-[#4C4D56]">
            <div className="flex max-w-[430px] flex-col gap-4 pb-5 max-md:max-w-full">
              <div className="flex">
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
                  <div key={i} className="flex">
                    <div className="w-1/2">{title}</div>
                    <div className="w-1/4">{price}</div>
                    <div className="w-1/4">{quantity}</div>
                  </div>
                );
              })}
              <div className="flex gap-2">
                {/* <b>Total Amount: </b> {formattedTotal} */}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <hr className="mb-1" />
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
                      <div key={i} className="flex gap-2">
                        <b>Address:</b> {field.value}
                      </div>
                    );
                  }

                  if (field.marker === 'date') {
                    const date = UseDate({
                      fullDate: field.value.fullDate,
                      format: 'en',
                    });
                    return (
                      <div key={i} className="flex gap-2">
                        <b>Delivery date: </b> {date}
                      </div>
                    );
                  }
                  if (field.marker === 'time') {
                    return (
                      <div key={i} className="flex gap-2">
                        <b>Delivery time: </b> {field.value}
                      </div>
                    );
                  }
                  return;
                },
              )}
              <hr className="mt-1" />
            </div>
          </div>
          <button
            onClick={() => onConfirmOrder()}
            className="btn btn-o btn-sm btn-o-primary mt-5 px-12"
          >
            Apply
          </button>
        </>
      )}
    </div>
  );
};

export default PaymentMethod;
