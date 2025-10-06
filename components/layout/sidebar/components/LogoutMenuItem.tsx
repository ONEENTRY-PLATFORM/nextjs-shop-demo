'use client';

import { useTransitionRouter } from 'next-transition-router';
import type { JSX } from 'react';
import { useContext } from 'react';

import { logOutUser } from '@/app/api';
import { AuthContext } from '@/app/store/providers/AuthContext';
import Profile from '@/components/icons/profile';

/**
 * Logout menu item.
 * @returns {JSX.Element} Logout menu item.
 */
const LogoutMenuItem = (): JSX.Element => {
  const router = useTransitionRouter();
  const { authenticate, isAuth } = useContext(AuthContext);

  if (!isAuth) {
    return <></>;
  }

  /**
   * logOut user with AuthContext authenticate function
   * @async
   */
  const onLogout = async () => {
    await logOutUser({ marker: 'email' });
    authenticate();
    router.push('/');
  };

  return (
    <li>
      <button
        className={`group cursor-pointer mr-auto flex justify-start gap-3 whitespace-nowrap hover:text-orange-500`}
        onClick={onLogout}
      >
        <div className="my-auto aspect-square size-4 shrink-0">
          <Profile />
        </div>
        <div>Logout</div>
      </button>
    </li>
  );
};

export default LogoutMenuItem;
