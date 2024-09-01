'use client';

import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import { useEffect } from 'react';

import { useGetOrderStorageByMarkerQuery, useGetProduct } from '@/app/api';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  addProductToCart,
  selectCartItems,
  selectCartTotal,
} from '@/app/store/reducers/CartSlice';
import { addProducts } from '@/app/store/reducers/OrderSlice';
import DeliveryTable from '@/components/layout/cart/DeliveryTable';
import PaymentButton from '@/components/layout/cart/PaymentButton';
import ProductCard from '@/components/layout/cart/ProductCard';
import TotalAmount from '@/components/layout/cart/TotalAmount';

import EmptyCart from './EmptyCart';

const CartPage = () => {
  const { product } = useGetProduct({ id: 83 });
  const { data, error } = useGetOrderStorageByMarkerQuery({
    marker: 'order',
  });
  const productsInCart = useAppSelector(selectCartItems) as Array<
    IProductsEntity & { quantity: number; selected: boolean }
  >;
  const dispatch = useAppDispatch();

  const total = useAppSelector(selectCartTotal);

  useEffect(() => {
    if (!product) {
      return;
    }
    const index = productsInCart.findIndex(
      (product: { id: number }) => product.id === product.id,
    );
    if (index === -1) {
      dispatch(addProductToCart({ ...product, selected: true, quantity: 1 }));
    }
  }, [product]);

  useEffect(() => {
    const productsInOrder = productsInCart.map(
      (product: IProductsEntity & { quantity: number }) => {
        return {
          productId: product.id,
          quantity: product.quantity,
        };
      },
    );
    //   const groupItems = items.reduce((results: ItemsInBusketType, item) => {
    //     if (item.selected) {
    //       (results[item.id] = results[item.id] || []).push(item);
    //       return results;
    //     }
    //     return results;
    //   }, {});

    dispatch(addProducts(productsInOrder));
  }, [productsInCart]);

  // if (productsInCart.length < 1) {
  //   return <EmptyCart />;
  // }

  return (
    <div className="flex max-w-[730px] flex-col pb-5 max-md:max-w-full">
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
      <DeliveryTable {...(product as IProductsEntity)} />
      <div className="mt-4 flex w-[464px] max-w-full flex-col self-end font-bold">
        <TotalAmount amount={total} />
        <PaymentButton />
      </div>
    </div>
  );
};

export default CartPage;
