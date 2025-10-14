/* eslint-disable jsdoc/reject-any-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Link from 'next/link';
import type { JSX } from 'react';

/**
 * User menu item component for rendering individual navigation links in the user profile menu.
 * Displays a single menu item with localized title and handles navigation to the specified page.
 * @param   {object}      props          - Component properties.
 * @param   {string}      props.lang     - Current language shortcode.
 * @param   {any}         props.page     - Current page.
 * @param   {any}         props.setState - Set state function.
 * @returns {JSX.Element}                User menu item link.
 */
const UserMenuItem = ({
  lang,
  page,
  setState,
}: {
  lang: string;
  page: any;
  setState: any;
}): JSX.Element => {
  /* Navigation link for the user menu item. Contains localized menu title and navigates to the page URL when clicked */
  return (
    <Link
      href={'/' + lang + '/' + page.pageUrl}
      title={page.localizeInfos.menuTitle}
      className="group relative box-border flex p-2 text-slate-800 hover:text-orange-500"
      onClick={() => setState(false)}
    >
      {/** Display the localized menu title for the page. This text is shown to the user as the menu item label */}
      {page.localizeInfos.menuTitle}
    </Link>
  );
};

export default UserMenuItem;
