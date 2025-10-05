'use client';

import Link from 'next/link';
import type { JSX } from 'react';
import { useEffect, useState } from 'react';

import { useAppSelector } from '@/app/store/hooks';
import CartAltIcon from '@/components/icons/cart';

/**
 * Nav item cart button.
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
      href={'/' + lang + '/' + pageUrl}
      title={localizeInfos.menuTitle}
      className="group relative box-border flex size-8 shrink-0 flex-col max-sm:size-6"
    >
      <CartAltIcon />
      <div className="absolute -right-1.5 -top-1 z-10 size-4 rounded-full text-white bg-orange-500 text-center text-xs leading-4">
        {count}
      </div>
    </Link>
  );
};

export default NavItemCart;
