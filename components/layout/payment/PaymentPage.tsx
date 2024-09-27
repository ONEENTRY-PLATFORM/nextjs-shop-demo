'use client';

// import { useRouter } from 'next/navigation';
import type { IOrderProductData } from 'oneentry/dist/orders/ordersInterfaces';
import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';
import { Suspense, useContext, useEffect, useMemo, useState } from 'react';

import { useGetAccountsQuery } from '@/app/api';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { AuthContext } from '@/app/store/providers/AuthContext';
import { selectCartItems } from '@/app/store/reducers/CartSlice';
import { addProducts, createOrder } from '@/app/store/reducers/OrderSlice';
import AuthError from '@/components/shared/AuthError';
import Loader from '@/components/shared/Loader';

import EmptyCart from '../cart/EmptyCart';
import PaymentMethod from './PaymentMethod';

const PaymentPage: FC<{ page: IPagesEntity; lang: string }> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  page,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  lang,
}) => {
  const { isAuth } = useContext(AuthContext);
  const paymentMethods = useAppSelector(
    (state) => state.orderReducer.paymentMethods,
  );
  // const router = useRouter();
  const dispatch = useAppDispatch();

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
    return <EmptyCart />;
  }

  return (
    <div className="flex max-w-[730px] flex-col gap-5 pb-5 max-md:max-w-full">
      <Suspense fallback={<Loader />}>
        {whitelistMethods.map((item, index) => {
          return <PaymentMethod key={index} account={item} />;
        })}
      </Suspense>
    </div>
  );
};

export default PaymentPage;
