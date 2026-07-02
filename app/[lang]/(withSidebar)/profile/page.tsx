import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { JSX } from 'react';

import { getPageByUrl } from '@/app/api';
import { ServerProvider } from '@/app/store/providers/ServerProvider';
import type { PageProps } from '@/app/types/global';
import ProfilePage from '@/components/layout/profile';
import { i18n, type Locale } from '@/i18n-config';

import { getDictionary } from '../../dictionaries';

/** OneEntry page marker (matches the route segment; verify in admin → Pages) */
const PAGE_MARKER = 'profile';

/**
 * Profile page.
 *
 * A dedicated route (instead of the dynamic `[page]` route) so it renders
 * inside the persistent `(withSidebar)` layout — the sidebar menu is not
 * remounted when navigating between sidebar pages.
 * @param   {object}               props        - Page props
 * @param   {PageProps}            props.params - page params
 * @returns {Promise<JSX.Element>}              Profile page JSX.Element
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/page Next.js docs}
 */
const ProfilePageLayout = async ({
  params,
}: PageProps): Promise<JSX.Element> => {
  /** Extract language parameter from the route params */
  const { lang } = await params;
  /** Get dictionary and set to server provider */
  const [dict] = ServerProvider('dict', await getDictionary(lang as Locale));

  /** Get page data by marker to make sure the page exists in the CMS */
  const { page, isError } = await getPageByUrl(PAGE_MARKER, lang);

  /** if error return notFound */
  if (isError || !page) {
    return notFound();
  }

  /** Render the profile page content (the sidebar is provided by the group layout) */
  return <ProfilePage lang={lang} dict={dict} />;
};

export default ProfilePageLayout;

/**
 * Pre-generation page params
 * @returns {Promise<{ lang: string }[]>} Static params for pre-generation
 */
export async function generateStaticParams(): Promise<{ lang: string }[]> {
  /** Initialize empty array for static params */
  const params: Array<{ lang: string }> = [];
  /** Loop through all available locales and add them to params */
  for (const lang of i18n.locales) {
    params.push({ lang });
  }
  /** Return array of static params for pre-rendering */
  return params;
}

/**
 * Generate page metadata from the CMS page localize infos
 * @param   {object}                    props        - Metadata params
 * @param   {Promise<{ lang: string }>} props.params - page params
 * @returns {Promise<Metadata>}                      metadata
 * @see {@link https://doc.oneentry.cloud/docs/pages OneEntry CMS docs}
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/page Next.js docs}
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  /** Extract language parameter from params */
  const { lang } = await params;
  /** Get page data by marker */
  const { page, isError } = await getPageByUrl(PAGE_MARKER, lang);

  /** if error return notFound */
  if (isError || !page) {
    return notFound();
  }

  return {
    title: page.localizeInfos?.title,
    description: page.localizeInfos?.title,
    openGraph: {
      type: 'article',
    },
  };
}
