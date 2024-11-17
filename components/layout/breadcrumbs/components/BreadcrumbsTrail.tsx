'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { FC, Key } from 'react';

import BreadcrumbItem from './BreadcrumbItem';

/**
 * Breadcrumbs trail
 * @param lang current language shortcode
 *
 * @returns JSX.Element
 */
const BreadcrumbsTrail: FC<{ lang: string }> = ({ lang }) => {
  const paths = usePathname();
  const pathNames = paths.split('/').filter((path: unknown) => path);

  return (
    <nav className="relative box-border flex">
      <ul className="flex w-full items-center gap-1.5 text-slate-300">
        <li>
          <Link href={'/' + lang + '/'} className=" hover:text-orange-500">
            Home
          </Link>
        </li>
        {pathNames?.map(
          (link: string, index: Key) =>
            link !== 'product' &&
            link !== 'category' &&
            link !== 'fr' &&
            link !== 'en' && (
              <li key={index}>
                <BreadcrumbItem
                  link={link}
                  lang={lang}
                  isLast={index === pathNames.length - 1}
                />
              </li>
            ),
        )}
      </ul>
    </nav>
  );
};

export default BreadcrumbsTrail;
