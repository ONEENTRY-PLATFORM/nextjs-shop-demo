/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import type { IOrderProductData } from 'oneentry/dist/orders/ordersInterfaces';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import { useEffect, useMemo, useState } from 'react';

import { api, useGetOrderStorageByMarkerQuery, useGetProduct } from '@/app/api';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  addProductToCart,
  removeAllProducts,
  selectCartItems,
  selectCartTotal,
} from '@/app/store/reducers/CartSlice';
import type { IAppOrder } from '@/app/store/reducers/OrderSlice';
import {
  addPaymentMethods,
  createOrder,
  // removeOrder,
} from '@/app/store/reducers/OrderSlice';
import DeliveryTable from '@/components/layout/cart/DeliveryTable';
import PaymentButton from '@/components/layout/cart/PaymentButton';
import ProductCard from '@/components/layout/cart/ProductCard';
import TotalAmount from '@/components/layout/cart/TotalAmount';

import EmptyCart from './EmptyCart';

const CartPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [cartTotal, setCartTotal] = useState(0);
  const [order, setOrder] = useState<IAppOrder | undefined>(undefined);
  const dispatch = useAppDispatch();
  const deliveryData = useGetProduct({ id: 83 });
  const { data, error } = useGetOrderStorageByMarkerQuery({
    marker: 'order',
  });
  const orderData = useAppSelector((state) => state.orderReducer.order);
  const total = useAppSelector(selectCartTotal);

  const productsInCart = useAppSelector(selectCartItems) as Array<
    IProductsEntity & { quantity: number; selected: boolean }
  >;

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setOrder(orderData);
  }, [orderData]);

  useEffect(() => {
    setCartTotal(total);
  }, [total]);

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
    if (data) {
      dispatch(addPaymentMethods(data.paymentAccountIdentifiers));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // add delivery to cart
  useEffect(() => {
    if (!deliveryData || !deliveryData.product) {
      return;
    }
    const index = productsInCart.findIndex(
      (p: { id: number }) => p.id === deliveryData.product?.id,
    );
    if (index === -1) {
      dispatch(
        addProductToCart({
          ...deliveryData.product,
          selected: true,
          quantity: 1,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deliveryData]);

  if (productsInCart.length < 2 || isLoading) {
    return <EmptyCart />;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmitOrder = (e: any) => {
    e.preventDefault();
    dispatch(
      createOrder({
        formIdentifier: 'order',
        formData: [],
        products: productsInOrder,
        paymentAccountIdentifier: '',
      }),
    );
    console.log(order);
  };

  // const createSession = async (id: number) => {
  //   if (!id) {
  //     return;
  //   }

  //   const { paymentUrl, id: orderId } = await api.Payments.createSession(
  //     id,
  //     'session',
  //   );
  //   if (order?.paymentAccountIdentifier === 'cash') {
  //     // return navigate('payment_success', { id });
  //     return 'payment_success';
  //   }

  //   if (paymentUrl) {
  //     // navigate('payment_method', { orderId, paymentUrl });
  //     return 'payment_method';
  //   }
  // };

  // const onConfirmOrder = async () => {
  //   setIsLoading(true);
  //   try {
  //     if (order?.formIdentifier && order?.paymentAccountIdentifier) {
  //       const editedFormData = order.formData.slice().map((data) => {
  //         return {
  //           marker: data.marker,
  //           type: data.type,
  //           value: data.value,
  //         };
  //       });
  //       const { id, paymentAccountIdentifier } = await api.Orders.createOrder(
  //         'order',
  //         {
  //           ...order,
  //           formData: editedFormData,
  //           formIdentifier: order.formIdentifier,
  //           paymentAccountIdentifier: order.paymentAccountIdentifier,
  //         },
  //       );

  //       dispatch(removeAllProducts());
  //       dispatch(removeOrder());

  //       if (paymentAccountIdentifier !== 'cash') {
  //         await createSession(id);
  //       } else {
  //         // return navigate('orders');
  //       }
  //     }
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   } catch (e: any) {
  //     console.error(e);
  //   }
  //   setIsLoading(false);
  // };

  return (
    <div
      className="flex w-full flex-col pb-5 lg:max-w-[730px]"
      onSubmit={(e) => onSubmitOrder(e)}
    >
      {productsInCart.length > 0 && (
        <div className="mb-4 flex w-full flex-col gap-4">
          {productsInCart.map((product: IProductsEntity, i: number) => {
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
      )}
      <form
        className="flex w-[730px] max-w-full flex-col pb-5"
        onSubmit={onSubmitOrder}
      >
        <DeliveryTable {...(deliveryData.product as IProductsEntity)} />
        <div className="mt-4 flex w-[464px] max-w-full flex-col self-center font-bold lg:self-end">
          <TotalAmount amount={cartTotal} />
          <PaymentButton />
        </div>
      </form>
    </div>
  );
};

export default CartPage;
