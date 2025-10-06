/* eslint-disable jsdoc/reject-any-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Link from 'next/link';
import type { FC, JSX } from 'react';

/**
 * User menu item.
 * @param   {object}      props          - Component properties.
 * @param   {string}      props.lang     - Current language shortcode.
 * @param   {any}         props.page     - Current page.
 * @param   {any}         props.setState - Set state function.
 * @returns {JSX.Element}                User menu item link.
 */
const UserMenuItem: FC<{
  lang: string;
  page: any;
  setState: any;
}> = ({
  lang,
  page,
  setState,
}: {
  lang: string;
  page: any;
  setState: any;
}): JSX.Element => {
  return (
    <Link
      href={'/' + lang + '/' + page.pageUrl}
      title={page.localizeInfos.menuTitle}
      className="group relative box-border flex p-2 text-slate-800 hover:text-orange-500"
      onClick={() => setState(false)}
    >
      {page.localizeInfos.menuTitle}
    </Link>
  );
};

export default UserMenuItem;
