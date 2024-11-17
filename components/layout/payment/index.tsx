/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import type { IOrderProductData } from 'oneentry/dist/orders/ordersInterfaces';
import type { FC } from 'react';
import { useContext, useEffect, useMemo } from 'react';

import { useGetAccountsQuery } from '@/app/api';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { AuthContext } from '@/app/store/providers/AuthContext';
import { selectCartData } from '@/app/store/reducers/CartSlice';
import { addProducts, createOrder } from '@/app/store/reducers/OrderSlice';
import type { SimplePageProps } from '@/app/types/global';
import PaymentMethod from '@/components/layout/payment/components/PaymentMethod';
import AuthError from '@/components/pages/AuthError';
import Loader from '@/components/shared/Loader';

/**
 * Payment page
 * @param lang current language shortcode
 * @param dict dictionary from server api
 *
 * @returns JSX.Element
 */
const PaymentPage: FC<SimplePageProps> = ({ lang, dict }) => {
  const dispatch = useAppDispatch();
  const { isAuth } = useContext(AuthContext);

  // Payment methods in orderSlice
  const paymentMethods = useAppSelector(
    (state) => state.orderReducer.paymentMethods,
  );

  // Products data in orderSlice
  const productsCartData = useAppSelector(selectCartData) as Array<{
    id: number;
    quantity: number;
    selected: boolean;
  }>;

  // Delivery data in orderSlice
  const deliveryData = useAppSelector((state) => state.cartReducer.delivery);

  // Get all payment accounts as an array
  const { data, error, isLoading } = useGetAccountsQuery({});

  // Allowed payment methods
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

  // Products in orderSlice
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

  // Create order in orderSlice on init component
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

  // add products to orderSlice
  useEffect(() => {
    if (productsInOrder) {
      dispatch(addProducts(productsInOrder));
    }
  }, [productsInOrder]);

  // Auth Error
  if (!isAuth || error) {
    return <AuthError dict={dict} />;
  }

  // Loader
  if ((productsCartData.length < 1 && isLoading) || isLoading) {
    return <Loader />;
  }

  return (
    <div className={'flex max-w-[730px] flex-col gap-5 pb-5 max-md:max-w-full'}>
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
  );
};

export default PaymentPage;
