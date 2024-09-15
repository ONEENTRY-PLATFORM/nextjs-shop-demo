'use client';

import { useRouter } from 'next/navigation';
import type { IOrderProductData } from 'oneentry/dist/orders/ordersInterfaces';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';
import { useEffect, useMemo, useState } from 'react';

import { useGetFormByMarkerQuery, useGetProduct } from '@/app/api';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  addProductToCart,
  selectCartItems,
  selectDeliveryData,
} from '@/app/store/reducers/CartSlice';
import {
  addData,
  addProducts,
  createOrder,
} from '@/app/store/reducers/OrderSlice';
import DeliveryTable from '@/components/layout/cart/DeliveryTable';
import PaymentButton from '@/components/layout/cart/PaymentButton';
import ProductCard from '@/components/layout/cart/ProductCard';
import TotalAmount from '@/components/layout/cart/TotalAmount';

import EmptyCart from './EmptyCart';

const CartPage: FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const delivery = useGetProduct({ id: 83 });

  const deliveryData = useAppSelector(selectDeliveryData);

  const productsInCart = useAppSelector(selectCartItems) as Array<
    IProductsEntity & { quantity: number; selected: boolean }
  >;

  const productsInOrder = useMemo(() => {
    return productsInCart.reduce((results: Array<IOrderProductData>, item) => {
      results.push({
        productId: item.id,
        quantity: item.quantity,
      });
      return results;
    }, []);
  }, [productsInCart]);

  useEffect(() => {
    setIsLoading(false);
    dispatch(
      createOrder({
        formIdentifier: 'order',
        formData: [
          // {
          //   marker: 'date',
          //   type: 'string',
          //   value: '',
          //   valid: true,
          // },
        ],
        products: productsInOrder,
        paymentAccountIdentifier: '',
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (productsInOrder) {
      dispatch(addProducts(productsInOrder));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productsInOrder]);

  // add delivery to cart
  useEffect(() => {
    if (!delivery || !delivery.product) {
      return;
    }
    const index = productsInCart.findIndex(
      (p: { id: number }) => p.id === delivery.product?.id,
    );
    if (index === -1) {
      dispatch(
        addProductToCart({
          ...delivery.product,
          selected: true,
          quantity: 1,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delivery]);

  if (productsInCart.length < 2 || isLoading) {
    return <EmptyCart />;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmitOrder = (e: any) => {
    e.preventDefault();
    const address = deliveryData.address;
    const date = deliveryData.date;
    const time = deliveryData.time;
    dispatch(
      addData({
        marker: 'time',
        type: 'string',
        value: time,
        valid: time ? true : false,
      }),
    );
    dispatch(
      addData({
        marker: 'date',
        type: 'date',
        value: {
          fullDate: new Date(date).toISOString(),
          formattedValue: new Date(date).toDateString() + ' 00:00',
          formatString: 'YYYY-MM-DD',
        },
        valid: date ? true : false,
      }),
    );
    dispatch(
      addData({
        marker: 'order_address',
        type: 'string',
        value: address,
        valid: address ? true : false,
      }),
    );
    router.push('/payment');
  };

  return (
    <div className="flex w-full flex-col pb-5 lg:max-w-[730px]">
      {productsInCart.length > 0 && (
        <div className="mb-4 flex w-full flex-col gap-4">
          {productsInCart.map((product: IProductsEntity, i: number) => {
            if (product.id === 83) {
              return;
            }
            return (
              <ProductCard
                key={i}
                product={product as IProductsEntity & { selected: boolean }}
              />
            );
          })}
        </div>
      )}
      <form
        className="flex w-[730px] max-w-full flex-col pb-5"
        onSubmit={onSubmitOrder}
      >
        <DeliveryTable {...(delivery.product as IProductsEntity)} />
        <div className="mt-4 flex w-[464px] max-w-full flex-col self-center font-bold lg:self-end">
          <TotalAmount />
          <PaymentButton />
        </div>
      </form>
    </div>
  );
};

export default CartPage;
