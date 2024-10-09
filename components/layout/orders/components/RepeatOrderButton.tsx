'use client';

import { useRouter } from 'next/navigation';
import type { IOrderByMarkerEntity } from 'oneentry/dist/orders/ordersInterfaces';
import type { FC } from 'react';

import { getProductById } from '@/app/api';
import { useAppDispatch } from '@/app/store/hooks';
import { addProductToCart } from '@/app/store/reducers/CartSlice';
import { LanguageEnum } from '@/app/types/enum';
import Loader from '@/components/shared/Loader';

const RepeatOrderButton: FC<{
  data: IOrderByMarkerEntity;
  title: string;
  isLoading: boolean;
  lang: string;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
}> = ({ data, isLoading, title, lang }) => {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { products } = data;

  const repeatOrder = () => {
    products.map(async (p) => {
      if (p.id === 83) {
        return;
      }
      const { product } = await getProductById(Number(p.id), langCode);
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
    <button
      onClick={() => repeatOrder()}
      type="button"
      className="btn btn-sm btn-o btn-o-primary"
    >
      {title} {isLoading && <Loader />}
    </button>
  );
};

export default RepeatOrderButton;
