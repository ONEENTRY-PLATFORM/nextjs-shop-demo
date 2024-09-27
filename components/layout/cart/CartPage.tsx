'use client';

import { useRouter } from 'next/navigation';
import type { IOrderProductData } from 'oneentry/dist/orders/ordersInterfaces';
import type { IPagesEntity } from 'oneentry/dist/pages/pagesInterfaces';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';
import { useEffect, useMemo, useState } from 'react';

import { useGetProduct } from '@/app/api';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  addProductToCart,
  selectCartItems,
} from '@/app/store/reducers/CartSlice';
import { addProducts, createOrder } from '@/app/store/reducers/OrderSlice';
import DeliveryTable from '@/components/layout/cart/DeliveryTable';
import PaymentButton from '@/components/layout/cart/PaymentButton';
import ProductCard from '@/components/layout/cart/ProductCard';
import TotalAmount from '@/components/layout/cart/TotalAmount';

import EmptyCart from './EmptyCart';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CartPage: FC<{ page: IPagesEntity; lang: string }> = ({ page, lang }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const delivery = useGetProduct({ id: 83 });

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

  // add delivery product to cart
  useEffect(() => {
    if (!delivery || !delivery.product) {
      return;
    }
    const index = productsInCart.findIndex(
      (p: { id: number }) => p.id === delivery.product?.id,
    );
    if (index === -1) {
      dispatch(
        addProductToCart({
          ...delivery.product,
          selected: true,
          quantity: 1,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delivery]);

  if (productsInCart.length < 2 || isLoading) {
    return <EmptyCart />;
  }

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
        onSubmit={(e) => {
          e.preventDefault();
          router.push('/payment');
        }}
      >
        <DeliveryTable {...(delivery.product as IProductsEntity)} />
        <div className="mt-4 flex w-full flex-col">
          <TotalAmount
            className={
              'flex self-center text-lg font-bold leading-6 text-slate-700 lg:self-end'
            }
          />
          <PaymentButton className="self-end max-lg:self-center" />
        </div>
      </form>
    </div>
  );
};

export default CartPage;
