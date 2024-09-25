'use client';

import { useRouter } from 'next/navigation';
import type { IOrderByMarkerEntity } from 'oneentry/dist/orders/ordersInterfaces';
import type { FC } from 'react';

import { getProductById } from '@/app/api';
import { useAppDispatch } from '@/app/store/hooks';
import { addProductToCart } from '@/app/store/reducers/CartSlice';

const RepeatOrderButton: FC<{
  data: IOrderByMarkerEntity;
  isLoading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
}> = ({ data, isLoading }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { statusIdentifier, products } = data;

  const repeatOrder = () => {
    products.map(async (p) => {
      if (p.id === 83) {
        return;
      }
      const { product } = await getProductById(Number(p.id), 'en_US');
      if (!product) {
        return;
      }
      dispatch(
        addProductToCart({
          ...product,
          selected: true,
          quantity: p.quantity || 0,
        }),
      );
      return product;
    });
    router.push('/cart');
    return null;
  };

  return (
    statusIdentifier !== 'created' && (
      <button
        onClick={() => repeatOrder()}
        className="btn btn-sm btn-o btn-o-primary"
      >
        Repeat order
      </button>
    )
  );
};

export default RepeatOrderButton;
