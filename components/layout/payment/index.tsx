/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import type { IOrderProductData } from 'oneentry/dist/orders/ordersInterfaces';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';
import { Suspense, useContext, useEffect, useMemo, useState } from 'react';

import { useGetAccountsQuery } from '@/app/api';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { AuthContext } from '@/app/store/providers/AuthContext';
import { selectCartData } from '@/app/store/reducers/CartSlice';
import { addProducts, createOrder } from '@/app/store/reducers/OrderSlice';
import type { SimplePageProps } from '@/app/types/global';
import EmptyCart from '@/components/layout/cart/components/EmptyCart';
import PaymentMethod from '@/components/layout/payment/components/PaymentMethod';
import AuthError from '@/components/shared/AuthError';
import Loader from '@/components/shared/Loader';

import PaymentMethodsAnimations from './animations/PaymentMethodsAnimations';

const PaymentPage: FC<SimplePageProps> = ({ page, lang, dict }) => {
  const dispatch = useAppDispatch();
  const { isAuth } = useContext(AuthContext);
  const paymentMethods = useAppSelector(
    (state) => state.orderReducer.paymentMethods,
  );
  const [isLoading, setIsLoading] = useState(true);

  const { data, error } = useGetAccountsQuery({});

  const whitelistMethods = useMemo(() => {
    if (data) {
      return data.filter((method) => {
        const index = paymentMethods?.findIndex(
          (whitelistMethod) => method.identifier === whitelistMethod.identifier,
        );
        if (index !== -1) {
          return method;
        }
      });
    }
    return [];
  }, [data, paymentMethods]);

  const productsInCart = useAppSelector(selectCartData) as Array<
    IProductsEntity & { quantity: number; selected: boolean }
  >;

  // createOrder
  useEffect(() => {
    dispatch(
      createOrder({
        formIdentifier: 'order',
        formData: [],
        products: productsInOrder,
        paymentAccountIdentifier: '',
      }),
    );
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const productsInOrder = useMemo(() => {
    return productsInCart.reduce((results: Array<IOrderProductData>, item) => {
      if (item.selected) {
        results.push({
          productId: item.id,
          quantity: item.quantity,
        });
      }
      return results;
    }, []);
  }, [productsInCart]);

  // add products to order
  useEffect(() => {
    if (productsInOrder) {
      dispatch(addProducts(productsInOrder));
    }
  }, [productsInOrder]);

  if (!isAuth || error) {
    return <AuthError dict={dict} />;
  }

  if (productsInCart.length < 2 && isLoading) {
    return <Loader />;
  }

  if (productsInCart.length < 2 || isLoading) {
    return <EmptyCart lang={lang} dict={dict} />;
  }

  return (
    <Suspense fallback={<Loader />}>
      <PaymentMethodsAnimations
        className={'flex max-w-[730px] flex-col gap-5 pb-5 max-md:max-w-full'}
      >
        {whitelistMethods.map((item, index) => {
          return (
            <PaymentMethod
              key={index}
              index={index as number}
              account={item}
              lang={lang}
              dict={dict}
            />
          );
        })}
      </PaymentMethodsAnimations>
    </Suspense>
  );
};

export default PaymentPage;
