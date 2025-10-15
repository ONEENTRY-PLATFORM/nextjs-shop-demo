import Link from 'next/link';
import type { JSX } from 'react';

import { getPageByUrl } from '@/app/api';

/**
 * 404 page layout
 * @async
 * @returns {Promise<JSX.Element>} page layout JSX.Element
 * @see {@link https://doc.oneentry.cloud/docs/pages OneEntry CMS docs}
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/not-found Next.js docs}
 */
const NotFound = async (): Promise<JSX.Element> => {
  const lang = 'en';
  /** get page by url from the API. */
  const { page, isError } = await getPageByUrl('404', lang);

  /** if no page data return fallback */
  if (isError || !page) {
    return (
      <div className="mx-auto flex min-h-80 w-full max-w-(--breakpoint-xl) flex-col items-center justify-center py-8">
        <h1 className="mb-10 text-6xl">404</h1>
        <Link href="/">Return home</Link>
      </div>
    );
  }

  /** extract data from page */
  const { localizeInfos, attributeValues } = page;

  return (
    <div className="mx-auto flex min-h-96 w-full max-w-(--breakpoint-xl) flex-col items-center justify-center py-8 text-neutral-700">
      <h1 className="mb-10 text-6xl">{localizeInfos?.title}</h1>
      <p className="mb-4">
        {attributeValues?.error_description?.value[0]?.plainValue}
      </p>
      <Link href="/" className="btn btn-o btn-sm btn-o-primary">
        Return home
      </Link>
    </div>
  );
};

export default NotFound;
