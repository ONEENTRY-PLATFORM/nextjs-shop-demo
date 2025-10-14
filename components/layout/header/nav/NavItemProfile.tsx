'use client';

import Link from 'next/link';
import type {
  IMenusEntity,
  IMenusPages,
} from 'oneentry/dist/menus/menusInterfaces';
import type { JSX } from 'react';
import { useContext } from 'react';

import { AuthContext } from '@/app/store/providers/AuthContext';
import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';
import ProfileAltIcon from '@/components/icons/profile';

import UserProfileMenu from './user-menu/UserProfileMenu';

/**
 * Navigation item profile component that handles user authentication state.
 * Renders different elements based on authentication status:
 * - Sign in button for unauthenticated users
 * - Profile link for authenticated users without menu
 * - Full profile menu for authenticated users with menu
 * @param   {object}       props          - Props.
 * @param   {IMenusPages}  props.item     - menu item.
 * @param   {string}       props.lang     - current language shortcode.
 * @param   {IMenusEntity} props.userMenu - Represents a menu object.
 * @returns {JSX.Element}                 JSX.Element.
 */
const NavItemProfile = ({
  item,
  lang,
  userMenu,
}: {
  item: IMenusPages;
  lang: string;
  userMenu: IMenusEntity;
}): JSX.Element => {
  /**
   * Get drawer state and control functions from OpenDrawerContext
   * Used to open/close the sign in form drawer
   */
  const { open, setOpen, setComponent } = useContext(OpenDrawerContext);

  /**
   * Get authentication status from AuthContext
   * Determines which UI element to render
   */
  const { isAuth } = useContext(AuthContext);

  return !isAuth ? (
    /**
     * Render sign in button for unauthenticated users
     * Opens the sign in form in a drawer when clicked
     */
    <button
      onClick={() => {
        setOpen(!open);
        setComponent('SignInForm');
      }}
      title={item.localizeInfos.menuTitle}
      className="group cursor-pointer relative box-border flex size-8 shrink-0 max-sm:size-6"
    >
      <ProfileAltIcon />
    </button>
  ) : !userMenu ? (
    /**
     * Render profile link for authenticated users without a user menu
     * Navigates directly to the profile page
     */
    <Link
      href={'/' + lang + '/profile'}
      title={item.localizeInfos.menuTitle}
      className="group cursor-pointer relative box-border flex size-8 shrink-0 max-sm:size-6"
    >
      <ProfileAltIcon />
    </Link>
  ) : (
    /**
     * Render full profile menu for authenticated users with a user menu
     * Displays a dropdown menu with user-specific navigation options
     */
    <UserProfileMenu
      lang={lang}
      userMenu={userMenu}
      title={item.localizeInfos.menuTitle}
    />
  );
};

export default NavItemProfile;
