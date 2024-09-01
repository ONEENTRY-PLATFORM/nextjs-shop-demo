'use client';

import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  addProductToCart,
  selectCartItems,
  selectCartTotal,
} from '@/app/store/reducers/CartSlice';
import DeliveryTable from '@/components/layout/cart/DeliveryTable';
import PaymentButton from '@/components/layout/cart/PaymentButton';
import ProductCard from '@/components/layout/cart/ProductCard';
import TotalAmount from '@/components/layout/cart/TotalAmount';
import { useGetProduct } from '@/app/api';
import EmptyCart from './EmptyCart';
import { useEffect } from 'react';

const CartPage = () => {
  const { product } = useGetProduct({id: 83});
  const productsInCart = useAppSelector(
    selectCartItems,
  ) as Array<IProductsEntity & { selected: boolean }>;
  const dispatch = useAppDispatch();

  const total = useAppSelector(selectCartTotal);

  useEffect(() => {
    if (!product) {
      return;
    }
    const index = productsInCart.findIndex(
      (product: { id: number }) => product.id === product.id,
    );
    if (index === -1) {
      dispatch(addProductToCart({ ...product, selected: true, quantity: 1 }));
    }
  }, [product]);

  // if (productsInCart.length < 1) {
  //   return <EmptyCart />;
  // }

  return (
    <div className="flex max-w-[730px] flex-col pb-5 max-md:max-w-full">
      <div className="flex w-full gap-4 flex-col mb-4">
        {productsInCart?.map((product: IProductsEntity, i: number) => {
          if (product.id === 83) {
            return;
          }
          return <ProductCard key={i} product={product as IProductsEntity & { selected: boolean; }} />;
        })}
      </div>
      <DeliveryTable {...product as IProductsEntity} />
      <div className="mt-4 flex w-[464px] max-w-full flex-col self-end font-bold">
        <TotalAmount amount={total} />
        <PaymentButton />
      </div>
    </div>
  );
};

export default CartPage;
