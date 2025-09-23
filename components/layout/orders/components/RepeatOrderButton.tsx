'use client';

import { useTransitionRouter } from 'next-transition-router';
import type { IOrderByMarkerEntity } from 'oneentry/dist/orders/ordersInterfaces';
import type { FC } from 'react';

import { getProductById } from '@/app/api';
import { useAppDispatch } from '@/app/store/hooks';
import { addProductToCart } from '@/app/store/reducers/CartSlice';
import { LanguageEnum } from '@/app/types/enum';
import Loader from '@/components/shared/Loader';

interface RepeatOrderButtonProps {
  data: IOrderByMarkerEntity;
  title: string;
  isLoading: boolean;
  lang: string;
}

/**
 * RepeatOrder button
 * @param data
 * @param title
 * @param isLoading loading state
 * @param lang current language shortcode
 *
 * @returns JSX.Element
 */
const RepeatOrderButton: FC<RepeatOrderButtonProps> = ({
  data,
  isLoading,
  title,
  lang,
}) => {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  const router = useTransitionRouter();
  const dispatch = useAppDispatch();

  const { products } = data;

  // repeatOrder - extract products from order and add to cart
  const repeatOrderHandle = () => {
    products.map(async (p) => {
      if (p.id === 83) {
        return;
      }
      const { isError, product } = await getProductById(Number(p.id), langCode);
      if (isError || !product) {
        return;
      }
      dispatch(
        addProductToCart({
          id: product.id,
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
      onClick={() => repeatOrderHandle()}
      type="button"
      className="btn btn-sm btn-o btn-o-primary"
    >
      {title} {isLoading && <Loader />}
    </button>
  );
};

export default RepeatOrderButton;
