/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useTransitionRouter } from 'next-transition-router';
import type { IOrderByMarkerEntity } from 'oneentry/dist/orders/ordersInterfaces';
import type { FC, JSX } from 'react';

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
 * RepeatOrder button component.
 * Provides a button that allows users to re-order all products from a previous order.
 * @param   {RepeatOrderButtonProps} props           - Component props
 * @param   {IOrderByMarkerEntity}   props.data      - Order data containing products to repeat
 * @param   {boolean}                props.isLoading - Loading state to show spinner when processing
 * @param   {string}                 props.title     - Button title text
 * @param   {string}                 props.lang      - Current language shortcode for product fetching
 * @returns {JSX.Element}                            Repeat order button element with loading indicator
 */
const RepeatOrderButton: FC<RepeatOrderButtonProps> = ({
  data,
  isLoading,
  title,
  lang,
}: RepeatOrderButtonProps): JSX.Element => {
  /** Convert language shortcode to enum value for API requests */
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];

  /** Get router instance for navigation with transitions */
  const router = useTransitionRouter();

  /** Get dispatch function for Redux actions */
  const dispatch = useAppDispatch();

  /** Extract products from order data */
  const { products } = data;

  /**
   * Repeat order handler - extract products from order and add to cart
   *
   * This function processes all products in an order (except product ID 83) by:
   * 1. Fetching each product's details by its ID
   * 2. Adding valid products to the shopping cart
   * 3. Redirecting user to the cart page
   * @returns {Promise<void>} resolves when all products are processed and user is redirected
   */
  const repeatOrderHandle = async (): Promise<void> => {
    /** Filter out product with ID 83 and create promises to fetch each product */
    const productPromises = products
      .filter((p: any) => p.id !== 83)
      .map(async (p: any) => {
        /** Fetch product details by ID */
        const { product, isError } = await getProductById(
          Number(p.id),
          langCode,
        );
        if (isError || !product) {
          return;
        }
        /** Add fetched product to cart with specified quantity */
        dispatch(
          addProductToCart({
            id: product.id,
            selected: true,
            quantity: p.quantity || 0,
          }),
        );
        return product;
      });

    /** Wait for all product fetching and adding operations to complete */
    await Promise.all(productPromises);
    /** Navigate to cart page */
    router.push('/cart');
    return;
  };

  /* Render the repeat order button */
  return (
    <button
      onClick={() => repeatOrderHandle()}
      type="button"
      className="btn btn-sm btn-o btn-o-primary"
    >
      {/** Display button title and loading spinner when processing */}
      {title} {isLoading && <Loader />}
    </button>
  );
};

export default RepeatOrderButton;
