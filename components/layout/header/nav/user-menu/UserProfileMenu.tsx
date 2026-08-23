'use client';

import type {
  IAttributeValues,
  IMenusEntity,
  IMenusPages,
} from 'oneentry/types';
import type { JSX } from 'react';
import { useState } from 'react';

import ProfileIcon from '@/components/icons/profile';

import ProfileMenuAnimations from '../../animations/ProfileMenuAnimations';
import LogoutMenuItem from './LogoutMenuItem';
import UserMenuItem from './UserMenuItem';

/**
 * User Profile menu component for displaying the user profile dropdown menu.
 * Renders a profile icon button that opens a dropdown menu with user-related navigation links.
 * @param   {object}           props          - UserProfileMenu props.
 * @param   {string}           props.lang     - Current language shortcode.
 * @param   {IMenusEntity}     props.userMenu - Represents a menu object.
 * @param   {string}           props.title    - Menu title.
 * @param   {IAttributeValues} props.dict     - Dictionary with localized values from server API.
 * @returns {JSX.Element}                     User Profile menu.
 */
const UserProfileMenu = ({
  lang,
  userMenu,
  title,
  dict,
}: {
  lang: string;
  title: string;
  userMenu: IMenusEntity;
  dict: IAttributeValues;
}): JSX.Element => {
  /**
   * State to control the visibility of the profile menu dropdown
   * When true, the dropdown menu is shown; when false, it is hidden
   */
  const [state, setState] = useState(false);

  /**
   * Extract pages from user menu with active state information
   * These are the individual menu items to be displayed in the dropdown
   */
  const pages = userMenu?.pages as Array<IMenusPages & { isActive: boolean }>;

  /**
   * Return empty fragment if no pages are available
   * Prevents rendering an empty menu
   */
  if (!pages) {
    return <></>;
  }

  return (
    /*
     * Container for the user profile menu with relative positioning.
     * Hover opens/closes the dropdown (standard desktop behaviour); because the
     * dropdown is a DOM child of this container, moving the cursor onto the menu
     * does not trigger onMouseLeave.
     */
    <div
      className="relative"
      onMouseEnter={() => setState(true)}
      onMouseLeave={() => setState(false)}
    >
      {/** Profile icon button — toggles the dropdown for touch devices (no hover) */}
      <button
        onClick={() => {
          setState((prev) => !prev);
        }}
        title={title}
        data-testid="user-menu-button"
        className="group relative box-border flex size-8 shrink-0 cursor-pointer max-sm:size-6"
      >
        <ProfileIcon />
      </button>
      {/** Profile menu animations wrapper with dropdown styling */}
      <ProfileMenuAnimations
        className="absolute top-8 left-0 h-0 w-48 overflow-hidden rounded-md bg-white px-4 text-slate-800 shadow-lg"
        state={state}
      >
        {/** Dropdown menu content with user navigation links */}
        {pages && (
          <ul className="my-4 text-gray-800">
            {pages.map((page) => {
              return (
                <li key={page.id}>
                  <UserMenuItem lang={lang} page={page} setState={setState} />
                </li>
              );
            })}
            <li>
              <LogoutMenuItem dict={dict} />
            </li>
          </ul>
        )}
      </ProfileMenuAnimations>
    </div>
  );
};

export default UserProfileMenu;
