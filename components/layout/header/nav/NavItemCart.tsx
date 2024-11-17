'use client';

import Link from 'next/link';
import type { FC } from 'react';
import { useEffect, useState } from 'react';

import { useAppSelector } from '@/app/store/hooks';
import CartIcon from '@/components/icons/cart';

/**
 * Nav item cart button
 * @param item
 * @param lang current language shortcode
 *
 * @returns JSX.Element
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const NavItemCart: FC<{ item: any; lang: string }> = ({ item, lang }) => {
  const [count, setCount] = useState(0);

  // get count from cart reducer
  const cartCount = useAppSelector((state) => {
    if (state.cartReducer.productsData.length < 1) {
      return 0;
    }
    return state.cartReducer.productsData
      .map((item: { id: number; quantity: number }) => {
        if (item.id === 83) {
          return 0;
        }
        return item.quantity;
      })
      .reduce((total: number, num: number) => {
        return total + num;
      });
  });

  useEffect(() => {
    setCount(cartCount);
  }, [cartCount]);

  const { pageUrl, localizeInfos } = item;

  return (
    <Link
      prefetch={true}
      href={'/' + lang + '/' + pageUrl}
      title={localizeInfos.menuTitle}
      className="group relative box-border flex size-6 shrink-0 flex-col"
    >
      <CartIcon />
      <div className="absolute -right-1.5 -top-1 z-10 size-4 rounded-full bg-orange-400 text-center text-sm leading-4">
        {count}
      </div>
    </Link>
  );
};

export default NavItemCart;
