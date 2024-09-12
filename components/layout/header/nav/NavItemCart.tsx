'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { useAppSelector } from '@/app/store/hooks';
// import { selectBasketCount } from '@/app/store/reducers/CartSlice';
import CartIcon from '@/components/icons/cart';

const item = {
  icon: '/icons/cart.svg',
  href: '/cart',
  title: 'Cart',
};

const NavItemCart: React.FC = () => {
  const [count, setCount] = useState(0);
  // const cartCount = useAppSelector(selectBasketCount);

  const cartCount = useAppSelector((state) => {
    return state.cartReducer.products
      .map((item) => {
        if (item.attributeSetIdentifier === 'service_product') {
          return 0;
        }
        return item.quantity;
      })
      .reduce((total, num) => {
        return total + num;
      });
  });

  useEffect(() => {
    setCount(cartCount);
  }, [cartCount]);

  return (
    <Link
      href={item.href}
      title={item.title}
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
