'use client';

import { useTransitionRouter } from 'next-transition-router';
import type { IAttributeValues } from 'oneentry/types';
import type { JSX } from 'react';
import { useContext } from 'react';

import { logOutUser } from '@/app/api';
import { AuthContext } from '@/app/store/providers/AuthContext';

/**
 * Logout menu item button component for handling user logout functionality.
 * Provides a button that logs out the user and redirects to the homepage.
 * @param   {object}           props      - Component properties
 * @param   {IAttributeValues} props.dict - Dictionary with localized values from server API
 * @returns {JSX.Element}                 JSX Logout menu item button.
 */
const LogoutMenuItem = ({ dict }: { dict: IAttributeValues }): JSX.Element => {
  /** Get authentication context to update authentication state after logout */
  const { authenticate } = useContext(AuthContext);

  /** Get router instance for navigation with transition effects */
  const router = useTransitionRouter();

  /**
   * Handle user logout process
   * Logs out the user via API call, updates authentication state, and redirects to homepage
   * @async
   */
  const onLogoutHandle = async (): Promise<void> => {
    /** Call logout API with email marker */
    await logOutUser({ marker: 'email' });

    /** Update authentication state in context */
    authenticate();

    /** Redirect user to homepage after logout */
    router.push('/');
  };

  return (
    /** Logout button with hover effects. Triggers logout process when clicked */
    <button
      className={`group flex cursor-pointer justify-start p-2 text-slate-800 hover:text-orange-500`}
      data-testid="logout-button"
      onClick={onLogoutHandle}
    >
      <div>{(dict?.log_out_button?.value as string) || 'Logout'}</div>
    </button>
  );
};

export default LogoutMenuItem;
