'use client';

import { useTransitionRouter } from 'next-transition-router';
import type { JSX } from 'react';
import { useContext } from 'react';

import { logOutUser } from '@/app/api';
import { AuthContext } from '@/app/store/providers/AuthContext';

/**
 * Logout menu item button.
 * @returns {JSX.Element} JSX Logout menu item button.
 */
const LogoutMenuItem = (): JSX.Element => {
  const { authenticate } = useContext(AuthContext);
  const router = useTransitionRouter();

  /**
   * logOut user
   * @async
   */
  const onLogoutHandle = async (): Promise<void> => {
    await logOutUser({ marker: 'email' });
    authenticate();
    router.push('/');
  };

  return (
    <button
      className={`group flex justify-start p-2 text-slate-800 hover:text-orange-500`}
      onClick={onLogoutHandle}
    >
      <div>Logout</div>
    </button>
  );
};

export default LogoutMenuItem;
