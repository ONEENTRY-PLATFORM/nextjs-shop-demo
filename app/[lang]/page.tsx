/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { JSX } from 'react';
import { Suspense } from 'react';

import { getPageByUrl } from '@/app/api';
import { blocksColors, blocksData } from '@/components/data';
import BlocksGrid from '@/components/layout/blocks-grid';
import BlocksGridLoader from '@/components/layout/blocks-grid/components/BlocksGridLoader';
import { i18n } from '@/i18n-config';

import { getImageUrl } from '../api/hooks/useAttributesData';
import { generatePageMetadata } from '../utils/generatePageMetadata';

/** Increase revalidation time to reduce server load (60 seconds instead of 10) */
export const revalidate = 60;

/** Enable dynamic route parameters */
export const dynamicParams = true;

interface IndexPageLayoutProps {
  params: Promise<{ lang: string }>;
}

/**
 * Home(index) page component
 * @param   {object}                   props        - Page parameters including language
 * @param   {Promise<{lang: string;}>} props.params - Language parameter
 * @returns {Promise<JSX.Element>}                  JSX.Element representing the page layout
 * @see {@link https://doc.oneentry.cloud/docs/pages OneEntry CMS docs}
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/page Next.js docs}
 */
const IndexPageLayout = async ({
  params,
}: IndexPageLayoutProps): Promise<JSX.Element> => {
  /** Destructure language parameter from params */
  const { lang } = await params;

  /** Validate language parameter */
  if (!lang || !i18n.locales.includes(lang as any)) {
    return notFound();
  }

  /** Fetch home page data by URL from the API */
  const { page, isError } = await getPageByUrl('home_web', lang);

  /** If there's an error, render a "not found" page */
  if (isError || !page) {
    // eslint-disable-next-line no-console
    console.log('Failed to load home page:', isError);
    return notFound();
  }

  /** If no page or blocks are found, render a loading state */
  if (!page.blocks) {
    return (
      <BlocksGridLoader blocksData={blocksData} blocksColors={blocksColors} />
    );
  }

  /** Extract blocks from the fetched page data */
  const { blocks } = page;

  /** Organization structured data */
  const organizationStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'OneEntry Shop',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/${lang}`,
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/logo.png`,
  };

  /** WebSite structured data */
  const websiteStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'OneEntry Shop',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/${lang}`,
  };

  /** Render the main layout of the page */
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteStructuredData),
        }}
      />
      <main className="flex flex-col items-center justify-between gap-16">
        <section className="relative mx-auto box-border flex w-full max-w-(--breakpoint-xl) shrink-0 grow flex-col self-stretch">
          <div className="flex w-full flex-col items-center gap-5 bg-white">
            <Suspense
              fallback={
                <BlocksGridLoader
                  blocksData={blocksData}
                  blocksColors={blocksColors}
                />
              }
            >
              <BlocksGrid blocks={blocks as Array<string>} lang={lang} />
            </Suspense>
          </div>
        </section>
      </main>
    </>
  );
};

/** Export the default component */
export default IndexPageLayout;

/**
 * Pre-generation of shop page
 * @returns {Promise<{ lang: string }[]>} Promise resolving to an array of language objects
 */
export async function generateStaticParams(): Promise<{ lang: string }[]> {
  /** Initialize an empty array to hold the static parameters */
  const params: Array<{ lang: string }> = [];
  /** Loop through all available locales and create parameter objects */
  for (const lang of i18n.locales) {
    params.push({ lang });
  }
  /** Return the array of static parameters for pre-rendering */
  return params;
}

/**
 * Generate metadata for the page
 * @param   {object}                   props        - Page parameters including language
 * @param   {Promise<{lang: string;}>} props.params - Language parameter
 * @returns {Promise<Metadata>}                     Promise resolving to metadata object
 */
export async function generateMetadata({
  params,
}: IndexPageLayoutProps): Promise<Metadata> {
  /** Extract language parameter from route params */
  const { lang } = await params;
  /** Fetch home page data by URL and language */
  const { isError, page } = await getPageByUrl('home_web', lang);

  /** Return 404 page if there's an error or page not found */
  if (isError || !page) {
    return notFound();
  }
  /** Extract page information from the page object */
  const { localizeInfos, isVisible, attributeValues } = page;

  /** Return metadata object */
  return generatePageMetadata({
    title: localizeInfos.title,
    description: localizeInfos.plainContent,
    isVisible: isVisible,
    imageUrl: getImageUrl('opengraph_image', attributeValues),
    imageAlt: localizeInfos.title,
    lang: lang,
    handle: '',
    baseUrl: '',
  });
}
