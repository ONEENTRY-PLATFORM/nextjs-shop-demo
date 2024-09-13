'use client';

import { useRouter } from 'next/navigation';
import type { IOrderProductData } from 'oneentry/dist/orders/ordersInterfaces';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import { useEffect, useMemo, useState } from 'react';

import { useGetProduct } from '@/app/api';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  addProductToCart,
  selectCartItems,
} from '@/app/store/reducers/CartSlice';
import type { IAppOrder } from '@/app/store/reducers/OrderSlice';
import { addProducts, createOrder } from '@/app/store/reducers/OrderSlice';
import DeliveryTable from '@/components/layout/cart/DeliveryTable';
import PaymentButton from '@/components/layout/cart/PaymentButton';
import ProductCard from '@/components/layout/cart/ProductCard';
import TotalAmount from '@/components/layout/cart/TotalAmount';

import EmptyCart from './EmptyCart';

const CartPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<IAppOrder | undefined>(undefined);
  const dispatch = useAppDispatch();
  const deliveryData = useGetProduct({ id: 83 });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const orderData = useAppSelector((state) => state.orderReducer.order);

  const productsInCart = useAppSelector(selectCartItems) as Array<
    IProductsEntity & { quantity: number; selected: boolean }
  >;

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

  useEffect(() => {
    if (!orderData) {
      return;
    }
    setOrder(orderData);
  }, [orderData]);

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
    if (productsInOrder) {
      dispatch(addProducts(productsInOrder));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productsInOrder]);

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
    router.push('/payment');
  };

  return (
    <div className="flex w-full flex-col pb-5 lg:max-w-[730px]">
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
          <TotalAmount />
          <PaymentButton />
        </div>
      </form>
    </div>
  );
};

export default CartPage;
