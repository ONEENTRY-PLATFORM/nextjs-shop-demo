'use client';

import type { IOrderProducts } from 'oneentry/dist/orders/ordersInterfaces';
import type { FC, Key } from 'react';

import { useGetSingleOrderQuery } from '@/app/api';
import { useCreateOrder } from '@/app/api/hooks/useCreateOrder';
import Loader from '@/components/shared/Loader';
import { UseDate, UsePrice } from '@/components/utils';

import CancelOrderButton from './components/CancelOrderButton';
import ProductCard from './components/ProductCard';
import RepeatOrderButton from './components/RepeatOrderButton';

const OrderPage: FC<{
  id: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  settings: Record<string, any> | undefined;
}> = ({ id, settings }) => {
  const { data, isLoading, refetch } = useGetSingleOrderQuery({
    marker: 'order',
    id: id,
    activeLang: 'en_US',
  });
  const { onConfirmOrder } = useCreateOrder();

  if (!data || !settings) {
    return <Loader />;
  }

  const {
    currency,
    formData,
    products,
    statusIdentifier,
    totalSum,
    paymentAccountIdentifier,
    paymentAccountLocalizeInfos,
  } = data;

  const formattedTotal = UsePrice({
    amount: totalSum,
    currency: currency,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {
    status_of_payment_title,
    payment_account_title,
    go_to_pay_title,
    total_amount_title,
    repeat_order_title,
    cancel_order_title,
  } = settings;

  return (
    <div className="flex flex-col text-[#4C4D56]">
      <div className="flex max-w-[430px] flex-col gap-4 pb-5 max-md:max-w-full">
        {products.map((product: IOrderProducts, i: Key) => {
          if (product.id === 83) {
            return;
          }
          return (
            <ProductCard
              settings={settings}
              key={i}
              product={product}
              currency={currency}
            />
          );
        })}
      </div>
      <div className="flex flex-col gap-3">
        <hr className="mb-4" />
        {formData.map(
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
        <div className="flex gap-2">
          <b>{status_of_payment_title}: </b> {statusIdentifier}
        </div>
        <div className="flex gap-2">
          <div>
            <b>{payment_account_title}: </b> {paymentAccountLocalizeInfos.title}
          </div>
          {paymentAccountIdentifier === 'stripe' &&
            statusIdentifier === 'created' && (
              <button
                className="btn btn-sm btn-o-primary"
                onClick={onConfirmOrder}
              >
                {go_to_pay_title}
              </button>
            )}
        </div>
        <div className="flex gap-2 text-lg">
          <b>{total_amount_title}: </b> {formattedTotal}
        </div>
        <hr className="my-4" />
      </div>
      <div className="flex gap-4">
        <RepeatOrderButton
          data={data}
          title={repeat_order_title}
          isLoading={isLoading}
        />
        <CancelOrderButton
          data={data}
          title={cancel_order_title}
          isLoading={isLoading}
          refetch={refetch}
        />
      </div>
    </div>
  );
};

export default OrderPage;
