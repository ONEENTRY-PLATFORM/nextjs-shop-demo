'use client';

import Link from 'next/link';
import { useContext } from 'react';

import { AuthContext } from '@/app/store/providers/AuthContext';
import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';
import ProfileIcon from '@/components/icons/profile';

const NavItemProfile: React.FC = () => {
  const { open, setOpen, setComponent } = useContext(OpenDrawerContext);
  const { isAuth } = useContext(AuthContext);

  const item = {
    href: '/profile',
    title: 'user',
  };

  return !isAuth ? (
    <button
      onClick={() => {
        setOpen(!open);
        setComponent('SignInEmail');
      }}
      className="group relative box-border flex size-6 shrink-0"
    >
      <ProfileIcon />
    </button>
  ) : (
    <Link
      href={item.href}
      title={item.title}
      className="group relative box-border flex size-6 shrink-0"
    >
      <ProfileIcon />
    </Link>
  );
};

export default NavItemProfile;
