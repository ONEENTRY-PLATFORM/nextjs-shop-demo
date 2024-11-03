/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import type { IOrderProductData } from 'oneentry/dist/orders/ordersInterfaces';
import type { FC } from 'react';
import { Suspense, useContext, useEffect, useMemo } from 'react';

import { useGetAccountsQuery } from '@/app/api';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { AuthContext } from '@/app/store/providers/AuthContext';
import { selectCartData } from '@/app/store/reducers/CartSlice';
import { addProducts, createOrder } from '@/app/store/reducers/OrderSlice';
import type { SimplePageProps } from '@/app/types/global';
// import EmptyCart from '@/components/layout/cart/components/EmptyCart';
import PaymentMethod from '@/components/layout/payment/components/PaymentMethod';
import AuthError from '@/components/shared/AuthError';
import Loader from '@/components/shared/Loader';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PaymentPage: FC<SimplePageProps> = ({ page, lang, dict }) => {
  const dispatch = useAppDispatch();
  const { isAuth } = useContext(AuthContext);

  const paymentMethods = useAppSelector(
    (state) => state.orderReducer.paymentMethods,
  );
  const productsCartData = useAppSelector(selectCartData) as Array<{
    id: number;
    quantity: number;
    selected: boolean;
  }>;
  const deliveryData = useAppSelector((state) => state.cartReducer.delivery);

  const { data, error, isLoading } = useGetAccountsQuery({});

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

  const productsInOrder = useMemo(() => {
    return [
      ...productsCartData.reduce(
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
      ),
      {
        productId: deliveryData.id,
        quantity: 1,
        selected: true,
      },
    ];
  }, [productsCartData]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // add products to order
  useEffect(() => {
    if (productsInOrder) {
      dispatch(addProducts(productsInOrder));
    }
  }, [productsInOrder]);

  if (!isAuth || error) {
    return <AuthError dict={dict} />;
  }

  if (productsCartData.length < 1 && isLoading) {
    return <Loader />;
  }

  if (productsCartData.length < 1 || isLoading) {
    // return <EmptyCart lang={lang} dict={dict} />;
    return <Loader />;
  }

  return (
    <Suspense fallback={<Loader />}>
      <div
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
      </div>
    </Suspense>
  );
};

export default PaymentPage;
