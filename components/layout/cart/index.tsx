/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IOrderProductData } from 'oneentry/dist/orders/ordersInterfaces';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';
import { useEffect, useMemo, useState } from 'react';

import FadeTransition from '@/app/animations/FadeTransition';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  addProductToCart,
  selectCartData,
} from '@/app/store/reducers/CartSlice';
import { addProducts, createOrder } from '@/app/store/reducers/OrderSlice';
import type { IProducts } from '@/app/types/global';
import CartAnimations from '@/components/layout/cart/animations/CartAnimations';
import EmptyCart from '@/components/layout/cart/components/EmptyCart';
import ProductCard from '@/components/layout/cart/components/ProductCard';
import Loader from '@/components/shared/Loader';

import DeliveryForm from './delivery-table/DeliveryForm';

interface CartPageProps {
  lang: string;
  dict: IAttributeValues;
  deliveryData: IProductsEntity;
}

const CartPage: FC<CartPageProps> = ({ lang, dict, deliveryData }) => {
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const productsInCart = useAppSelector(selectCartData) as IProducts[];

  const productsInOrder = useMemo(() => {
    return productsInCart.reduce(
      (results: Array<IOrderProductData & { selected: boolean }>, item) => {
        if (item.selected) {
          results.push({
            productId: item.id,
            quantity: item.quantity,
            selected: item.selected,
          });
        }
        return results;
      },
      [],
    );
  }, [productsInCart]);

  // init cart
  useEffect(() => {
    // create Order
    dispatch(
      createOrder({
        formIdentifier: 'order',
        formData: [],
        products: productsInOrder,
        paymentAccountIdentifier: '',
      }),
    );

    // add delivery Data
    if (!deliveryData) {
      return;
    }
    dispatch(
      addProductToCart({
        id: deliveryData.id,
        selected: true,
        quantity: 1,
      }),
    );
    setIsLoading(false);
  }, []);

  // add products to order
  useEffect(() => {
    if (productsInOrder) {
      dispatch(addProducts(productsInOrder));
    }
  }, [productsInOrder]);

  if (isLoading) {
    return <Loader />;
  }

  if (productsInCart.length < 2) {
    return <EmptyCart lang={lang} dict={dict} />;
  }

  return (
    <FadeTransition
      className="flex w-full flex-col pb-5 lg:max-w-[730px]"
      index={0}
    >
      <CartAnimations className={'mb-4 flex w-full flex-col gap-4'} index={1}>
        {productsInCart
          .filter((p) => p.id !== 83)
          .map((product: IProducts, i: number) => {
            return (
              <ProductCard
                key={i}
                index={i}
                productData={product as IProducts}
                selected={productsInCart[i]?.selected}
                lang={lang}
              />
            );
          })}
      </CartAnimations>
      <DeliveryForm lang={lang} dict={dict} deliveryData={deliveryData} />
    </FadeTransition>
  );
};

export default CartPage;
