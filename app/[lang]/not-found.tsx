import Link from 'next/link';
import type { JSX } from 'react';

import { getPageByUrl } from '@/app/api';
import { i18n, type Locale } from '@/i18n-config';

import { getDictionary } from './dictionaries';

/**
 * 404 page layout
 * @async
 * @returns {Promise<JSX.Element>} page layout JSX.Element
 * @see {@link https://doc.oneentry.cloud/docs/pages OneEntry CMS docs}
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/not-found Next.js docs}
 */
const NotFound = async (): Promise<JSX.Element> => {
  /** not-found.tsx receives no route params — fall back to the default locale */
  const lang = i18n.defaultLocale;
  /** get page by url and the localized dictionary from the API. */
  const [{ page, isError }, dict] = await Promise.all([
    getPageByUrl('404', lang),
    getDictionary(lang as Locale),
  ]);

  /** localized texts from the `system_content` block with English fallbacks */
  const notFoundTitle = (dict.page_not_found_title?.value as string) || '404';
  const returnHomeText =
    (dict.return_home_text?.value as string) || 'Return home';

  /** if no page data return fallback */
  if (isError || !page) {
    return (
      <div className="mx-auto flex min-h-80 w-full max-w-(--breakpoint-xl) flex-col items-center justify-center py-8">
        <h1 className="mb-10 text-6xl">{notFoundTitle}</h1>
        <Link href="/">{returnHomeText}</Link>
      </div>
    );
  }

  /** extract data from page */
  const { localizeInfos, attributeValues } = page;

  return (
    <div className="mx-auto flex min-h-96 w-full max-w-(--breakpoint-xl) flex-col items-center justify-center py-8 text-neutral-700">
      <h1 className="mb-10 text-6xl">
        {localizeInfos?.title || notFoundTitle}
      </h1>
      <p className="mb-4">
        {(
          attributeValues?.error_description?.value as
            Array<{ plainValue?: string }> | undefined
        )?.[0]?.plainValue ||
          ((dict.content_not_found?.value as string) ?? '')}
      </p>
      <Link href="/" className="btn btn-o btn-sm btn-o-primary">
        {returnHomeText}
      </Link>
    </div>
  );
};

export default NotFound;
