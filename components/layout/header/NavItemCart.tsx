'use client';
import Image from 'next/image';
import Link from 'next/link';

import { useAppSelector } from '@/app/store/hooks';
import { selectBasketCount } from '@/app/store/reducers/CartSlice';

const item = {
  icon: '/icons/cart.svg',
  href: '/cart',
  title: 'cart',
};

const NavItemCart: React.FC = () => {
  const cartCount = useAppSelector(selectBasketCount);

  return (
    <Link
      href={item.href}
      title={item.title}
      className="relative box-border flex size-6 shrink-0 flex-col"
    >
      <Image
        className="object-contain"
        width={24}
        height={24}
        alt={item.title}
        src={item.icon}
        priority
      />
      <div className="absolute -right-1.5 -top-1 z-10 size-4 rounded-full bg-orange-400 text-center text-sm leading-4">
        {cartCount}
      </div>
    </Link>
  );
};

export default NavItemCart;
