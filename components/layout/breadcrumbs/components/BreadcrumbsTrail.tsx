'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { JSX, Key } from 'react';

import BreadcrumbItem from './BreadcrumbItem';

/**
 * Breadcrumbs trail component that displays the current navigation path
 * Parses the URL path and creates a trail of links showing the user's location
 * Excludes certain paths like product, category, and language codes
 * @param   {object}      props      - component props
 * @param   {string}      props.lang - current language shortcode for URL localization
 * @returns {JSX.Element}            Breadcrumb trail navigation component
 */
const BreadcrumbsTrail = ({ lang }: { lang: string }): JSX.Element => {
  /** Get current pathname from Next.js router */
  const paths = usePathname();

  /** Split pathname into segments and filter out empty segments */
  const pathNames = paths.split('/').filter((path: unknown) => path);

  return (
    /** Navigation container for breadcrumbs */
    <nav className="relative box-border flex">
      {/** Unordered list of breadcrumb items */}
      <ul className="flex w-full items-center gap-1.5 text-slate-300">
        {/** Home link as the first breadcrumb item */}
        <li>
          <Link href={'/' + lang + '/'} className=" hover:text-orange-500">
            Home
          </Link>
        </li>

        {/** Map through path segments to create breadcrumb items */}
        {pathNames?.map(
          (link: string, index: Key) =>
            link !== 'product' && // Exclude product path
            link !== 'category' && // Exclude category path
            link !== 'fr' && // Exclude French language code
            link !== 'en' && ( // Exclude English language code
              <li key={index}>
                {/** Breadcrumb item component with link, language and last item indicator */}
                <BreadcrumbItem
                  link={link}
                  lang={lang}
                  isLast={index === pathNames.length - 1} // Determine if this is the last item
                />
              </li>
            ),
        )}
      </ul>
    </nav>
  );
};

export default BreadcrumbsTrail;
