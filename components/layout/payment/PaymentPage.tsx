/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import type { IOrderProductData } from 'oneentry/dist/orders/ordersInterfaces';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';
import { Suspense, useContext, useEffect, useMemo, useState } from 'react';

import { useGetAccountsQuery } from '@/app/api';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { AuthContext } from '@/app/store/providers/AuthContext';
import { selectCartItems } from '@/app/store/reducers/CartSlice';
import { addProducts, createOrder } from '@/app/store/reducers/OrderSlice';
import type { SimplePageProps } from '@/app/types/global';
import EmptyCart from '@/components/layout/cart/EmptyCart';
import PaymentMethod from '@/components/layout/payment/PaymentMethod';
import AuthError from '@/components/shared/AuthError';
import Loader from '@/components/shared/Loader';

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

  const productsInCart = useAppSelector(selectCartItems) as Array<
    IProductsEntity & { quantity: number; selected: boolean }
  >;

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

  useEffect(() => {
    setIsLoading(false);
    dispatch(
      createOrder({
        formIdentifier: 'order',
        formData: [],
        products: productsInOrder,
        paymentAccountIdentifier: '',
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // add products to order
  useEffect(() => {
    if (productsInOrder) {
      dispatch(addProducts(productsInOrder));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productsInOrder]);

  if (!isAuth || error) {
    return <AuthError />;
  }

  if (productsInCart.length < 2 || isLoading) {
    return <EmptyCart lang={lang} />;
  }

  return (
    <div className="flex max-w-[730px] flex-col gap-5 pb-5 max-md:max-w-full">
      <Suspense fallback={<Loader />}>
        {whitelistMethods.map((item, index) => {
          return <PaymentMethod key={index} account={item} lang={lang} />;
        })}
      </Suspense>
    </div>
  );
};

export default PaymentPage;
