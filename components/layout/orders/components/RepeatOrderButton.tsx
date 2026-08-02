'use client';

import { useParams } from 'next/navigation';
import { useTransitionRouter } from 'next-transition-router';
import type { IOrderByMarkerEntity } from 'oneentry/dist/orders/ordersInterfaces';
import type { JSX } from 'react';

import { useAppDispatch } from '@/app/store/hooks';
import { addProductToCart } from '@/app/store/reducers/CartSlice';
import { DELIVERY_PRODUCT_ID } from '@/app/utils/constants';
import Loader from '@/components/shared/Loader';

/**
 * RepeatOrder button component.
 * Provides a button that allows users to re-order all products from a previous order.
 * @param   {object}               props           - Component props
 * @param   {IOrderByMarkerEntity} props.data      - Order data containing products to repeat
 * @param   {boolean}              props.isLoading - Loading state to show spinner when processing
 * @param   {string}               props.title     - Button title text
 * @returns {JSX.Element}                          Repeat order button element with loading indicator
 */
const RepeatOrderButton = ({
  data,
  isLoading,
  title,
}: {
  data: IOrderByMarkerEntity;
  title: string;
  isLoading: boolean;
}): JSX.Element => {
  /** Get router instance for navigation with transitions */
  const router = useTransitionRouter();

  /** Current locale for building locale-prefixed navigation paths */
  const params = useParams();
  const lang = (params.lang as string) || 'en';

  /** Get dispatch function for Redux actions */
  const dispatch = useAppDispatch();

  /** Extract products from order data */
  const { products } = data;

  /**
   * Repeat order handler - extract products from order and add to cart
   *
   * This function processes all products in an order (except the delivery product) by:
   * 1. Adding valid products to the shopping cart
   * 2. Redirecting user to the cart page
   * @returns {Promise<void>} resolves when all products are processed and user is redirected
   */
  const repeatOrderHandle = async (): Promise<void> => {
    /** Filter out the delivery product */
    products
      .filter((product) => product.id !== DELIVERY_PRODUCT_ID)
      .forEach(async (product) => {
        /** Add product to cart with specified quantity */
        dispatch(
          addProductToCart({
            id: product.id,
            selected: true,
            quantity: product.quantity || 0,
          }),
        );
        return product;
      });

    /**
     * Navigate to the locale-prefixed cart page (a bare `/cart` matches the
     * `[lang]` segment and flashes the home page skeleton before redirecting).
     */
    router.push(`/${lang}/cart`);
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
