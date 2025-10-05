'use client';

import type {
  IMenusEntity,
  IMenusPages,
} from 'oneentry/dist/menus/menusInterfaces';
import type { JSX } from 'react';
import { useState } from 'react';

import ProfileIcon from '@/components/icons/profile';

import ProfileMenuAnimations from '../../animations/ProfileMenuAnimations';
import LogoutMenuItem from './LogoutMenuItem';
import UserMenuItem from './UserMenuItem';

/**
 * User Profile menu.
 * @param   {object}       props          - UserProfileMenu props.
 * @param   {string}       props.lang     - Current language shortcode.
 * @param   {IMenusEntity} props.userMenu - Represents a menu object.
 * @param   {string}       props.title    - Menu title.
 * @returns {JSX.Element}                 User Profile menu.
 */
const UserProfileMenu = ({
  lang,
  userMenu,
  title,
}: {
  lang: string;
  title: string;
  userMenu: IMenusEntity;
}): JSX.Element => {
  const [state, setState] = useState(false);
  // extract pages from user menu
  const pages = userMenu?.pages as Array<IMenusPages & { isActive: boolean }>;

  if (!pages) {
    return <></>;
  }

  return (
    <div className="relative">
      <button
        onClick={() => {
          setState(true);
        }}
        title={title}
        className="group cursor-pointer relative box-border flex size-8 shrink-0 max-sm:size-6"
      >
        <ProfileIcon />
      </button>
      <ProfileMenuAnimations
        className="absolute left-0 top-8 h-0 w-48 overflow-hidden rounded-md bg-white px-4 text-slate-800 shadow-lg"
        state={state}
        setState={setState}
      >
        {pages && (
          <ul className="my-4 text-gray-800">
            {pages.map((page, i) => {
              return (
                <li key={i}>
                  <UserMenuItem lang={lang} page={page} setState={setState} />
                </li>
              );
            })}
            <li>
              <LogoutMenuItem />
            </li>
          </ul>
        )}
      </ProfileMenuAnimations>
    </div>
  );
};

export default UserProfileMenu;
