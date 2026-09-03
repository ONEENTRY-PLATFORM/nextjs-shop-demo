'use client';

import { useTransitionRouter } from 'next-transition-router';
import type { IAttributeValues } from 'oneentry/types';
import type { JSX } from 'react';
import { useContext } from 'react';

import { logOutUser } from '@/app/api/server/users/logOutUser';
import { AuthContext } from '@/app/store/providers/AuthContext';
import Profile from '@/components/icons/profile';

/**
 * Logout menu item component that displays a logout button in the sidebar menu.
 * This component is only visible when the user is authenticated.
 * When clicked, it logs out the user and redirects to the home page.
 * @param   {object}           props      - Component properties
 * @param   {IAttributeValues} props.dict - Dictionary with localized values from server API
 * @returns {JSX.Element}                 Logout menu item with icon and text.
 */
const LogoutMenuItem = ({ dict }: { dict: IAttributeValues }): JSX.Element => {
  /** Router for navigation with transition effects */
  const router = useTransitionRouter();

  /** Authentication context to check auth status and update it after logout */
  const { authenticate, isAuth } = useContext(AuthContext);

  /** Don't render the logout item if user is not authenticated */
  if (!isAuth) {
    return <></>;
  }

  /**
   * Handle user logout by calling the logout API, updating authentication state,
   * and redirecting to the home page.
   * @async
   */
  const onLogout = async () => {
    /** Call the logout API to invalidate the user session */
    await logOutUser({ marker: 'email' });

    /** Update the authentication context to reflect logged out state */
    authenticate();

    /** Redirect user to the home page after logout */
    router.push('/');
  };

  return (
    <li>
      <button
        className={`group mr-auto flex cursor-pointer justify-start gap-3 whitespace-nowrap hover:text-orange-500`}
        onClick={onLogout}
      >
        <div className="my-auto aspect-square size-4 shrink-0">
          <Profile />
        </div>
        <div>{(dict?.log_out_button?.value as string) || 'Logout'}</div>
      </button>
    </li>
  );
};

export default LogoutMenuItem;
