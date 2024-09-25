'use client';
import { useRouter } from 'next/navigation';
import type {
  IOrderData,
  IOrderProducts,
} from 'oneentry/dist/orders/ordersInterfaces';
import type { FC, Key } from 'react';

import {
  getProductById,
  updateOrderByMarkerAndId,
  useGetSingleOrderQuery,
} from '@/app/api';
import { useAppDispatch } from '@/app/store/hooks';
import { addProductToCart } from '@/app/store/reducers/CartSlice';
import Loader from '@/components/shared/Loader';
import { UseDate, UsePrice } from '@/components/utils';

import ProductCard from './ProductCard';

const OrderPage: FC<{ id: number }> = ({ id }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
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

  const cancelOrder = async () => {
    const formData = {
      ...data,
      statusIdentifier: 'canceled',
    } as unknown as IOrderData;
    console.log('cancelOrder');
    console.log(data);
    console.log(formData);

    await updateOrderByMarkerAndId({
      marker: 'order',
      id,
      data: formData,
    });
    return;
  };

  const repeatOrder = () => {
    data.products.map(async (p) => {
      if (p.id === 83) {
        return;
      }
      const { product } = await getProductById(Number(p.id), 'en_US');
      if (!product) {
        return;
      }
      dispatch(
        addProductToCart({
          ...product,
          selected: true,
          quantity: p.quantity || 0,
        }),
      );
      return product;
    });
    router.push('/cart');
    return null;
  };

  return (
    <div className="flex flex-col text-[#4C4D56]">
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
          <b>Status of Payment: </b> {statusIdentifier}
        </div>
        <div className="flex gap-2">
          <b>Total Amount: </b> {formattedTotal}
        </div>
        <hr className="my-4" />
      </div>
      <div className="flex gap-4">
        {statusIdentifier !== 'created' && (
          <button
            onClick={() => repeatOrder()}
            className="btn btn-sm btn-o btn-o-primary"
          >
            Repeat order
          </button>
        )}
        {statusIdentifier === 'created' && (
          <button
            onClick={() => cancelOrder()}
            className="btn btn-sm btn-o btn-o-primary"
          >
            Cancel order
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderPage;
