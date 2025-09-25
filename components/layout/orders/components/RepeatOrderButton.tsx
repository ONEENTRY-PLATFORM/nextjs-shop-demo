/* eslint-disable @typescript-eslint/no-explicit-any */
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
 *
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

  /**
   * Repeat order handler - extract products from order and add to cart
   *
   * This function processes all products in an order (except product ID 83) by:
   * 1. Fetching each product's details by its ID
   * 2. Adding valid products to the shopping cart
   * 3. Redirecting user to the cart page
   *
   * @returns Promise<void> - resolves when all products are processed and user is redirected
   */
  const repeatOrderHandle = async () => {
    // Filter out product with ID 83 and create promises to fetch each product
    const productPromises = products
      .filter((p: any) => p.id !== 83)
      .map(async (p: any) => {
        // Fetch product details by ID
        const { product, isError } = await getProductById(
          Number(p.id),
          langCode,
        );
        if (isError || !product) {
          return;
        }
        // Add fetched product to cart with specified quantity
        dispatch(
          addProductToCart({
            id: product.id,
            selected: true,
            quantity: p.quantity || 0,
          }),
        );
        return product;
      });

    // Wait for all product fetching and adding operations to complete
    await Promise.all(productPromises);
    // Navigate to cart page
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
