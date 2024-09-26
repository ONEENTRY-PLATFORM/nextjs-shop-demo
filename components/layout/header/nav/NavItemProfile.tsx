'use client';

import Link from 'next/link';
import type { FC } from 'react';
import { useContext } from 'react';

import { AuthContext } from '@/app/store/providers/AuthContext';
import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';
import ProfileIcon from '@/components/icons/profile';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const NavItemProfile: FC<{ item: any }> = ({ item }) => {
  const { open, setOpen, setComponent } = useContext(OpenDrawerContext);
  const { isAuth } = useContext(AuthContext);

  return !isAuth ? (
    <button
      onClick={() => {
        setOpen(!open);
        setComponent('SignInForm');
      }}
      title="Login"
      className="group relative box-border flex size-6 shrink-0"
    >
      <ProfileIcon />
    </button>
  ) : (
    <Link
      href={'/profile'}
      title={'Profile'}
      className="group relative box-border flex size-6 shrink-0"
    >
      <ProfileIcon />
    </Link>
  );
};

export default NavItemProfile;
