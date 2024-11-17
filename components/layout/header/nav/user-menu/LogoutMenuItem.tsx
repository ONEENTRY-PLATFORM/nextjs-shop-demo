'use client';

import { useTransitionRouter } from 'next-transition-router';
import type { FC } from 'react';
import { useContext } from 'react';

import { logOutUser } from '@/app/api';
import { AuthContext } from '@/app/store/providers/AuthContext';

/**
 * Logout menu item button
 * @returns JSX Logout menu item button
 */
const LogoutMenuItem: FC = () => {
  const { authenticate } = useContext(AuthContext);
  const router = useTransitionRouter();

  /**
   * logOut user
   * @async
   */
  const onLogoutHandle = async () => {
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
