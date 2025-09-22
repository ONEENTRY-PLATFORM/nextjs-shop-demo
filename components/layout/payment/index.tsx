'use client';

import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';
import { useContext, useEffect, useMemo } from 'react';

import { useGetAccountsQuery, useGetProductsByIdsQuery } from '@/app/api';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { AuthContext } from '@/app/store/providers/AuthContext';
import {
  addDeliveryToCart,
  addProductsToCart,
  selectCartData,
  selectCartItems,
} from '@/app/store/reducers/CartSlice';
import { addProducts, createOrder } from '@/app/store/reducers/OrderSlice';
import type { SimplePageProps } from '@/app/types/global';
import PaymentMethod from '@/components/layout/payment/components/PaymentMethod';
import AuthError from '@/components/pages/AuthError';
import Loader from '@/components/shared/Loader';

import EmptyCart from '../cart/components/EmptyCart';

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

  // Products data in cartSlice
  const productsCartData = useAppSelector(selectCartData) as Array<{
    id: number;
    quantity: number;
    selected: boolean;
  }>;

  // Products items in cartSlice
  const productsItems = useAppSelector(selectCartItems);

  // Delivery data in cartSlice
  const deliveryData = useAppSelector((state) => state.cartReducer.delivery);

  // Order data in orderSlice
  const orderData = useAppSelector((state) => state.orderReducer.order);

  // Check if we have products in cart
  const hasCartItems =
    productsCartData && productsCartData.some((item) => item.selected);

  // Get all payment accounts as an array
  const { data, error, isLoading: isAccountsLoading } = useGetAccountsQuery({});

  // Fetch products by IDs
  const { data: productsData, isLoading: isProductsLoading } =
    useGetProductsByIdsQuery(
      {
        items: productsCartData.map((p) => p.id.toString()).toString(),
      },
      {
        skip: productsCartData.length === 0,
      },
    );

  // Add delivery data to the cart
  useEffect(() => {
    if (deliveryData) {
      dispatch(addDeliveryToCart(deliveryData));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deliveryData]);

  // Add fetched products to the cart slice
  useEffect(() => {
    if (productsData) {
      dispatch(addProductsToCart(productsData as IProductsEntity[]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productsData]);

  // Combine products from cart and loaded products data
  const combinedProducts = useMemo(() => {
    if (!productsData || productsData.length === 0) {
      return productsItems;
    }
    return productsData;
  }, [productsData, productsItems]);

  // Allowed payment methods
  const whitelistMethods = useMemo(() => {
    if (!data) return [];

    // If no payment methods restriction, show all
    if (!paymentMethods || paymentMethods.length === 0) {
      return data;
    }

    // Filter by allowed payment methods
    return data.filter((method) => {
      return paymentMethods.some(
        (whitelistMethod) => method.identifier === whitelistMethod.identifier,
      );
    });
  }, [data, paymentMethods]);

  // Products in orderSlice
  const productsInOrder = useMemo(() => {
    if (!hasCartItems && !deliveryData) return [];

    const orderProducts = productsCartData
      .filter((item) => item.selected)
      .map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        selected: item.selected,
      }));

    // Add delivery if exists
    if (deliveryData?.id) {
      orderProducts.push({
        productId: deliveryData.id,
        quantity: 1,
        selected: true,
      });
    }

    return orderProducts;
  }, [productsCartData, deliveryData, hasCartItems]);

  // Create order in orderSlice on init component
  useEffect(() => {
    if (productsInOrder.length > 0) {
      dispatch(
        createOrder({
          formIdentifier: 'order',
          formData: orderData?.formData || [],
          products: productsInOrder,
          paymentAccountIdentifier: orderData?.paymentAccountIdentifier || '',
        }),
      );
      dispatch(addProducts(productsInOrder));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productsInOrder]);

  // Auth Error
  if (!isAuth || error) {
    return <AuthError dict={dict} />;
  }

  // Loader
  if (isAccountsLoading || isProductsLoading) {
    return <Loader />;
  }

  // If no products in cart
  if (!hasCartItems && !deliveryData) {
    return <EmptyCart lang={lang as string} dict={dict} />;
  }

  return (
    <div className={'flex max-w-[730px] flex-col gap-5 pb-5 max-md:max-w-full'}>
      {whitelistMethods.map((item, index) => {
        return (
          <PaymentMethod
            key={index}
            index={index as number}
            account={item}
            lang={lang as string}
            dict={dict}
            products={combinedProducts}
            delivery={deliveryData}
          />
        );
      })}
    </div>
  );
};

export default PaymentPage;
