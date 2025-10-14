'use client';

import Link from 'next/link';
import type { JSX } from 'react';
import { useEffect, useState } from 'react';

import { useAppSelector } from '@/app/store/hooks';
import CartAltIcon from '@/components/icons/cart';

/**
 * Navigation item cart button component for displaying the shopping cart icon with item count.
 * Renders a cart icon with a badge showing the number of items in the cart.
 * @param props      - component props.
 * @param props.item - menu item.
 * @param props.lang current language shortcode
 * @returns          JSX.Element.
 */

const NavItemCart = ({
  item,
  lang,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: any;
  lang: string;
}): JSX.Element => {
  /**
   * State to store the cart item count
   * This is updated when the cart reducer data changes
   */
  const [count, setCount] = useState(0);

  /**
   * Get cart item count from Redux cart reducer
   * Calculates the total number of items in the cart, excluding delivery item (id: 83)
   */
  const cartCount = useAppSelector((state) => {
    /**
     * Return 0 if there are no products in the cart
     */
    if (state.cartReducer.productsData.length < 1) {
      return 0;
    }

    return state.cartReducer.productsData
      .map((item: { id: number; quantity: number }) => {
        /**
         * Exclude delivery item (id: 83) from the count
         */
        if (item.id === 83) {
          return 0;
        }
        return item.quantity;
      })
      .reduce((total: number, num: number) => {
        /**
         * Sum all quantities to get the total item count
         */
        return total + num;
      });
  });

  /**
   * Update local count state when cartCount changes
   * This effect ensures the displayed count stays in sync with the Redux store
   */
  useEffect(() => {
    setCount(cartCount);
  }, [cartCount]);

  /**
   * Destructure page URL and localized information from the menu item
   */
  const { pageUrl, localizeInfos } = item;

  return (
    /**
     * Link to the cart page with cart icon and item count badge
     * Uses relative positioning to place the count badge in the top-right corner
     */
    <Link
      href={'/' + lang + '/' + pageUrl}
      title={localizeInfos.menuTitle}
      className="group relative box-border flex size-8 shrink-0 flex-col max-sm:size-6"
    >
      {/** Cart icon component */}
      <CartAltIcon />
      {/** Badge displaying the number of items in the cart */}
      <div className="absolute -right-1.5 -top-1 z-10 size-4 rounded-full text-white bg-orange-500 text-center text-xs leading-4">
        {count}
      </div>
    </Link>
  );
};

export default NavItemCart;
