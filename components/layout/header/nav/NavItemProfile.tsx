'use client';

import Link from 'next/link';
import type {
  IMenusEntity,
  IMenusPages,
} from 'oneentry/dist/menus/menusInterfaces';
import type { FC } from 'react';
import { useContext } from 'react';

import { AuthContext } from '@/app/store/providers/AuthContext';
import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';
import ProfileIcon from '@/components/icons/profile';

import UserProfileMenu from './user-menu/UserProfileMenu';

interface NavItemProfileProps {
  item: IMenusPages;
  lang: string;
  userMenu?: IMenusEntity;
}
/**
 * Nav item profile link / SignInForm button
 * @param item
 * @param lang current language shortcode
 * @param userMenu Represents a menu object.
 *
 * @returns JSX.Element
 */
const NavItemProfile: FC<NavItemProfileProps> = ({ item, lang, userMenu }) => {
  const { open, setOpen, setComponent } = useContext(OpenDrawerContext);
  const { isAuth } = useContext(AuthContext);

  return !isAuth ? (
    <button
      onClick={() => {
        setOpen(!open);
        setComponent('SignInForm');
      }}
      title={item.localizeInfos.menuTitle}
      className="group relative box-border flex size-6 shrink-0"
    >
      <ProfileIcon />
    </button>
  ) : !userMenu ? (
    <Link
      prefetch={true}
      href={'/' + lang + '/profile'}
      title={item.localizeInfos.menuTitle}
      className="group relative box-border flex size-6 shrink-0"
    >
      <ProfileIcon />
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
