/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import type { IOrderProductData } from 'oneentry/dist/orders/ordersInterfaces';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import { useEffect, useMemo } from 'react';

import { useGetOrderStorageByMarkerQuery, useGetProduct } from '@/app/api';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  addProductToCart,
  selectCartItems,
  selectCartTotal,
} from '@/app/store/reducers/CartSlice';
import {
  addPaymentMethods,
  createOrder,
} from '@/app/store/reducers/OrderSlice';
import DeliveryTable from '@/components/layout/cart/DeliveryTable';
import PaymentButton from '@/components/layout/cart/PaymentButton';
import ProductCard from '@/components/layout/cart/ProductCard';
import TotalAmount from '@/components/layout/cart/TotalAmount';

import EmptyCart from './EmptyCart';

const CartPage = () => {
  const dispatch = useAppDispatch();
  const { product } = useGetProduct({ id: 83 });
  const { data, error } = useGetOrderStorageByMarkerQuery({
    marker: 'order',
  });

  // const st = useAppSelector((state) => state.orderReducer);
  const total = useAppSelector(selectCartTotal);

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
    if (data) {
      dispatch(
        createOrder({
          formIdentifier: 'order',
          formData: [],
          products: productsInOrder,
          paymentAccountIdentifier: '',
        }),
      );
      dispatch(addPaymentMethods(data.paymentAccountIdentifiers));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // add delivery to cart
  useEffect(() => {
    if (!product) {
      return;
    }
    const index = productsInCart.findIndex(
      (p: { id: number }) => p.id === product.id,
    );
    if (index === -1) {
      dispatch(addProductToCart({ ...product, selected: true, quantity: 1 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  if (productsInCart.length < 2) {
    return <EmptyCart />;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmitOrder = (e: any) => {
    e.preventDefault();
    // console.log(e);
  };

  return (
    <div
      className="flex max-w-[730px] flex-col pb-5 max-md:max-w-full"
      onSubmit={(e) => {
        onSubmitOrder(e);
      }}
    >
      <div className="mb-4 flex w-full flex-col gap-4">
        {productsInCart?.map((product: IProductsEntity, i: number) => {
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
      <form
        className="flex max-w-[730px] flex-col pb-5 max-md:max-w-full"
        onSubmit={onSubmitOrder}
      >
        <DeliveryTable {...(product as IProductsEntity)} />
        <div className="mt-4 flex w-[464px] max-w-full flex-col self-end font-bold">
          <TotalAmount amount={total} />
          <PaymentButton />
        </div>
      </form>
    </div>
  );
};

export default CartPage;
