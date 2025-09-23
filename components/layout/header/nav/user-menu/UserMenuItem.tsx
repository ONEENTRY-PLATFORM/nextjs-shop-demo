'use client';

import Link from 'next/link';
import type { FC } from 'react';

/**
 * User menu item
 * @param lang Current language shortcode
 * @param page
 * @param setState
 *
 * @returns User menu item link
 */
const UserMenuItem: FC<{
  lang: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  page: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setState: any;
}> = ({ lang, page, setState }) => {
  return (
    <Link
      prefetch={true}
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
