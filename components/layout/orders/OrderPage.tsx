/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import type { IOrderProducts } from 'oneentry/dist/orders/ordersInterfaces';
import type { Key } from 'react';

import { useGetSingleOrderQuery } from '@/app/api';
import Loader from '@/components/shared/Loader';
import { UsePrice } from '@/components/utils';

import ProductCard from './ProductCard';

const OrderPage: React.FC<{ id: number }> = ({ id }) => {
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
        {formData.map((field, i) => {
          if (field.marker === 'order_address') {
            return (
              <div key={i} className="flex gap-2">
                <b>Address:</b> {field.value}
              </div>
            );
          }
          if (field.marker === 'date') {
            return (
              <div key={i} className="flex gap-2">
                <b>Delivery: </b> {field.value.fullDate}
              </div>
            );
          }
          return;
        })}
        <div className="flex gap-2">
          <b>Status of Payment: </b> {statusIdentifier}
        </div>
        <hr className="mt-4" />
      </div>
    </div>
  );
};

export default OrderPage;
