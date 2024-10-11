'use client';

import { useRouter } from 'next/navigation';
import type { IOrderProductData } from 'oneentry/dist/orders/ordersInterfaces';
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
import type { SimplePageProps } from '@/app/types/global';
import DeliveryTable from '@/components/layout/cart/components/DeliveryTable';
import PaymentButton from '@/components/layout/cart/components/PaymentButton';
import ProductCard from '@/components/layout/cart/components/ProductCard';
import TotalAmount from '@/components/layout/cart/components/TotalAmount';
import EmptyCart from '@/components/layout/cart/EmptyCart';

const CartPage: FC<SimplePageProps> = ({ lang }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const delivery = useGetProduct({ id: 83 });

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
    return <EmptyCart lang={lang} />;
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
                lang={lang}
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
        <DeliveryTable
          lang={lang}
          delivery={delivery.product as IProductsEntity}
        />
        <div className="mt-4 flex w-full flex-col">
          <TotalAmount
            lang={lang}
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
