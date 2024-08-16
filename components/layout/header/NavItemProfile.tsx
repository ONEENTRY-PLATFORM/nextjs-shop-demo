'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

const NavItemProfile: React.FC = () => {
  const { open, setOpen } = useContext(OpenDrawerContext);
  const item = {
    icon: '/icons/user.svg',
    href: '/profile',
    title: 'user',
  };

  return !open ? (
    <button onClick={() => setOpen(!open)}>
      <Image
        className="object-contain"
        width={24}
        height={24}
        alt={item.title}
        src={item.icon}
        priority
      />
    </button>
  ) : (
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
    </Link>
  );
};

export default NavItemProfile;
