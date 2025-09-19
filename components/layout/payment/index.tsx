/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import type { IOrderProductData } from 'oneentry/dist/orders/ordersInterfaces';
import type { FC } from 'react';
import { useContext, useEffect, useMemo, useState } from 'react';

import { useGetAccountsQuery, useGetProductsByIdsQuery } from '@/app/api';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { AuthContext } from '@/app/store/providers/AuthContext';
import {
  selectCartData,
  selectCartItems,
  // selectCartTotal,
} from '@/app/store/reducers/CartSlice';
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
  const [isInitialized, setIsInitialized] = useState(false);

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

  // Cart total
  // const cartTotal = useAppSelector(selectCartTotal);

  // Delivery data in cartSlice
  const deliveryData = useAppSelector((state) => state.cartReducer.delivery);

  // Order data in orderSlice
  const orderData = useAppSelector((state) => state.orderReducer.order);

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

  // Combine products from cart and loaded products data
  const combinedProducts = useMemo(() => {
    if (!productsData || productsData.length === 0) {
      return productsItems;
    }
    return productsData;
  }, [productsData, productsItems]);

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
        return [];
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
        productId: deliveryData?.id,
        quantity: 1,
        selected: true,
      },
    ].filter((product) => product.productId);
  }, [productsCartData, deliveryData]);

  // Create order in orderSlice on init component
  useEffect(() => {
    // Initialize order if it doesn't exist or is empty
    if (
      productsInOrder.length > 0 &&
      (!orderData || orderData.products?.length === 0)
    ) {
      dispatch(
        createOrder({
          formIdentifier: 'order',
          formData: [],
          products: productsInOrder,
          paymentAccountIdentifier: orderData?.paymentAccountIdentifier || '',
        }),
      );
      dispatch(addProducts(productsInOrder));
      setIsInitialized(true);
    } else if (
      productsInOrder.length === 0 &&
      orderData?.products?.length > 0
    ) {
      // If we have order data but no cart data, we still want to show the order
      setIsInitialized(true);
    } else if (productsInOrder.length > 0 && orderData?.products?.length > 0) {
      // Already initialized
      setIsInitialized(true);
    }
  }, [productsInOrder, orderData]);

  // Auth Error
  if (!isAuth || error) {
    return <AuthError dict={dict} />;
  }

  // Loader
  if (
    (productsCartData.length > 0 && (isAccountsLoading || isProductsLoading)) ||
    isAccountsLoading ||
    (!isInitialized && productsCartData.length > 0)
  ) {
    return <Loader />;
  }

  // If no products in cart and no order data, nothing to show
  if (
    productsCartData.length === 0 &&
    (!orderData || orderData.products?.length === 0)
  ) {
    return <div className="p-4">No items in cart</div>;
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
            products={combinedProducts}
            delivery={deliveryData}
          />
        );
      })}
    </div>
  );
};

export default PaymentPage;
