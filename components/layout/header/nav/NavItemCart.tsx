'use client';

import Link from 'next/link';

import { useAppSelector } from '@/app/store/hooks';
import { selectBasketCount } from '@/app/store/reducers/CartSlice';
import CartIcon from '@/components/icons/cart';

const item = {
  icon: '/icons/cart.svg',
  href: '/cart',
  title: 'Cart',
};

const NavItemCart: React.FC = () => {
  const cartCount = useAppSelector(selectBasketCount);

  return (
    <Link
      href={item.href}
      title={item.title}
      className="group relative box-border flex size-6 shrink-0 flex-col"
    >
      <CartIcon />
      <div className="absolute -right-1.5 -top-1 z-10 size-4 rounded-full bg-orange-400 text-center text-sm leading-4">
        {cartCount}
      </div>
    </Link>
  );
};

export default NavItemCart;
