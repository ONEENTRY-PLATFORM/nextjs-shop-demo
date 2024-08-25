'use client';

import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

import { useAppSelector } from '@/app/store/hooks';
import {
  selectCartItems,
  selectCartTotal,
} from '@/app/store/reducers/CartSlice';
import DeliveryTable from '@/components/layout/cart/DeliveryTable';
import PaymentButton from '@/components/layout/cart/PaymentButton';
import ProductCard from '@/components/layout/cart/ProductCard';
import TotalAmount from '@/components/layout/cart/TotalAmount';

import EmptyCart from './EmptyCart';

const CartPage = () => {
  const productsInCart = useAppSelector(
    selectCartItems,
  ) as Array<IProductsEntity>;

  const total = useAppSelector(selectCartTotal);

  if (productsInCart.length < 1) {
    return <EmptyCart />;
  }

  return (
    <div className="flex max-w-[730px] flex-col pb-5 max-md:max-w-full">
      {productsInCart.map((product: IProductsEntity, i: number) => {
        return <ProductCard key={i} product={product} />;
      })}
      <DeliveryTable />
      <div className="mt-4 flex w-[464px] max-w-full flex-col self-end font-bold">
        <TotalAmount amount={total} />
        <PaymentButton />
      </div>
    </div>
  );
};

export default CartPage;
