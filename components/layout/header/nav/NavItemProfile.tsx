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
 * Nav item profile link / SignInForm button.
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
  const { open, setOpen, setComponent } = useContext(OpenDrawerContext);
  const { isAuth } = useContext(AuthContext);

  return !isAuth ? (
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
    <Link
      href={'/' + lang + '/profile'}
      title={item.localizeInfos.menuTitle}
      className="group cursor-pointer relative box-border flex size-8 shrink-0 max-sm:size-6"
    >
      <ProfileAltIcon />
    </Link>
  ) : (
    <UserProfileMenu
      lang={lang}
      userMenu={userMenu}
      title={item.localizeInfos.menuTitle}
    />
  );
};

export default NavItemProfile;
