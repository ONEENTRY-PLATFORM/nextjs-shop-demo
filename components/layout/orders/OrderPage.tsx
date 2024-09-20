'use client';

import type { IOrderProducts } from 'oneentry/dist/orders/ordersInterfaces';
import type { FC, Key } from 'react';

import { useGetSingleOrderQuery } from '@/app/api';
import Loader from '@/components/shared/Loader';
import { UseDate, UsePrice } from '@/components/utils';

import ProductCard from './ProductCard';

const OrderPage: FC<{ id: number }> = ({ id }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data, isLoading, refetch } = useGetSingleOrderQuery({
    marker: 'order',
    id: id,
    activeLang: 'en_US',
  });

  if (isLoading || !data) {
    return <Loader />;
  }
  const {
    createdDate,
    currency,
    formData,
    products,
    statusIdentifier,
    totalSum,
  } = data;

  const formattedTotal = UsePrice({
    amount: totalSum,
    currency: currency,
  });

  return (
    <div className="flex flex-col text-[#4C4D56]">
      <div className="mb-4 flex">№{createdDate}</div>
      <div className="flex max-w-[430px] flex-col gap-4 pb-5 max-md:max-w-full">
        {products.map((product: IOrderProducts, i: Key) => {
          if (product.id === 83) {
            return;
          }
          return <ProductCard key={i} product={product} currency={currency} />;
        })}
      </div>
      <div className="flex flex-col gap-3">
        <hr className="mb-4" />
        <div className="flex gap-2">
          <b>Total Amount: </b> {formattedTotal}
        </div>
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
              // const d = new Date(field.value.fullDate);
              // const year = new Intl.DateTimeFormat('en', {
              //   year: 'numeric',
              // }).format(d);
              // const month = new Intl.DateTimeFormat('en', {
              //   month: 'short',
              // }).format(d);
              // const day = new Intl.DateTimeFormat('en', {
              //   day: '2-digit',
              // }).format(d);

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
          <b>Status of Payment: </b> {statusIdentifier}
        </div>
        <hr className="mt-4" />
      </div>
    </div>
  );
};

export default OrderPage;
