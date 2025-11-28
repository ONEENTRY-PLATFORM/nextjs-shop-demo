/* eslint-disable jsdoc/no-undefined-types */
'use client';

import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { JSX } from 'react';
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
 * Payment page component.
 * Main payment page that displays available payment methods and handles the checkout process.
 * Manages product data, delivery information, and order creation.
 * Integrates with Redux store for state management and API hooks for data fetching.
 * Handles authentication checks and loading states.
 * @param   {SimplePageProps}  props      - Component properties.
 * @param   {string}           props.lang - Current language shortcode for localization.
 * @param   {IAttributeValues} props.dict - Dictionary from server API containing localized text values.
 * @returns {JSX.Element}                 Payment page component.
 */
const PaymentPage = ({ lang, dict }: SimplePageProps): JSX.Element => {
  /** Redux dispatch function for state updates */
  const dispatch = useAppDispatch();

  /** Authentication context to check if user is logged in */
  const { isAuth } = useContext(AuthContext);

  /** Retrieve payment methods from Redux order slice */
  const paymentMethods = useAppSelector(
    (state) => state.orderReducer.paymentMethods,
  );

  /** Retrieve products data from cart slice */
  const productsCartData = useAppSelector(selectCartData) as Array<{
    id: number;
    quantity: number;
    selected: boolean;
  }>;

  /** Retrieve product items from cart slice */
  const productsItems = useAppSelector(selectCartItems);

  /** Retrieve delivery data from cart slice */
  const deliveryData = useAppSelector((state) => state.cartReducer.delivery);

  /** Retrieve order data from order slice */
  const orderData = useAppSelector((state) => state.orderReducer.order);

  /** Check if we have products in cart */
  const hasCartItems =
    productsCartData && productsCartData.some((item) => item.selected);

  /** Fetch all available payment accounts from the API */
  const { data, error, isLoading: isAccountsLoading } = useGetAccountsQuery({});

  /** Fetch products by their IDs from the cart */
  const { data: productsData, isLoading: isProductsLoading } =
    useGetProductsByIdsQuery(
      {
        items: productsCartData.map((p) => p.id.toString()).toString(),
      },
      {
        skip: productsCartData.length === 0,
      },
    );

  /** Add delivery data to the cart when it changes */
  useEffect(() => {
    if (deliveryData) {
      dispatch(addDeliveryToCart(deliveryData));
    }
  }, [deliveryData, dispatch]);

  /** Add fetched products to the cart slice when they are loaded */
  useEffect(() => {
    if (productsData) {
      dispatch(addProductsToCart(productsData as IProductsEntity[]));
    }
  }, [dispatch, productsData]);

  /** Combine products from cart and loaded products data */
  const combinedProducts = useMemo(() => {
    if (!productsData || productsData.length === 0) {
      return productsItems;
    }
    return productsData;
  }, [productsData, productsItems]);

  /** Filter payment methods based on whitelist from order slice */
  const whitelistMethods = useMemo(() => {
    if (!data) return [];

    /** If no payment methods restriction, show all */
    if (!paymentMethods || paymentMethods.length === 0) {
      return data;
    }

    /** Filter by allowed payment methods */
    return data.filter((method) => {
      return paymentMethods.some(
        (whitelistMethod) => method.identifier === whitelistMethod.identifier,
      );
    });
  }, [data, paymentMethods]);

  /** Prepare products for order creation */
  const productsInOrder = useMemo(() => {
    if (!hasCartItems && !deliveryData) return [];

    const orderProducts = productsCartData
      .filter((item) => item.selected)
      .map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        selected: item.selected,
      }));

    /** Add delivery if exists */
    if (deliveryData?.id) {
      orderProducts.push({
        productId: deliveryData.id,
        quantity: 1,
        selected: true,
      });
    }

    return orderProducts;
  }, [productsCartData, deliveryData, hasCartItems]);

  /** Create order in orderSlice on component initialization */
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

  if (!dict) {
    return <></>;
  }

  /** Auth Error */
  if (!isAuth || error) {
    return <AuthError dict={dict} />;
  }

  /** Loader */
  if (isAccountsLoading || isProductsLoading) {
    return <Loader />;
  }

  /** If no products in cart */
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
