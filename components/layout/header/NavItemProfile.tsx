'use client';

import Link from 'next/link';
import { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';
import ProfileIcon from '@/components/icons/profile';

const NavItemProfile: React.FC = () => {
  const { open, setOpen, setComponent } = useContext(OpenDrawerContext);
  const item = {
    href: '/profile',
    title: 'user',
  };

  return !open ? (
    <button
      onClick={() => {
        setOpen(!open);
        setComponent('SignInEmail');
      }}
    >
      <ProfileIcon />
    </button>
  ) : (
    <Link
      href={item.href}
      title={item.title}
      className="relative box-border flex size-6 shrink-0 flex-col"
    >
      <ProfileIcon />
    </Link>
  );
};

export default NavItemProfile;
