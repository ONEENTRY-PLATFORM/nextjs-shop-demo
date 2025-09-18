import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { FC } from 'react';
import { Suspense } from 'react';

// Import custom API function and components
import { getPageByUrl } from '@/app/api';
import BlocksGrid from '@/components/layout/blocks-grid';
import BlocksGridLoader from '@/components/layout/blocks-grid/components/BlocksGridLoader';
import { i18n } from '@/i18n-config';

// Set revalidation time for the page (in seconds)
export const revalidate = 10;

// Enable dynamic route parameters
export const dynamicParams = true;

/**
 * Home(index) page component
 * @async server component
 *
 * @param params - Page parameters including language
 * @see {@link https://doc.oneentry.cloud/docs/pages OneEntry CMS docs}
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/page Next.js docs}
 * @returns JSX.Element representing the page layout
 */
const IndexPageLayout: FC<{
  params: Promise<{ lang: string }>;
}> = async ({ params }) => {
  // Destructure language parameter from params
  const { lang } = await params;

  // Fetch home page data by URL from the API
  const { page, isError } = await getPageByUrl('home_web', lang);

  // If there's an error, render a "not found" page
  if (isError) {
    return notFound();
  }

  // If no page or blocks are found, render a loading state
  if (!page || !page.blocks) {
    return <BlocksGridLoader />;
  }

  // Extract blocks from the fetched page data
  const { blocks } = page;

  // Render the main layout of the page
  return (
    <main className="flex flex-col items-center justify-between gap-16">
      <section className="relative mx-auto box-border flex w-full max-w-(--breakpoint-xl) shrink-0 grow flex-col self-stretch">
        <div className="flex w-full flex-col items-center gap-5 bg-white">
          {/* Use React's Suspense to handle asynchronous rendering of blocks */}
          <Suspense fallback={<BlocksGridLoader />}>
            <BlocksGrid blocks={blocks as Array<string>} lang={lang} />
          </Suspense>
        </div>
      </section>
    </main>
  );
};

// Export the default component
export default IndexPageLayout;

/**
 * Generate metadata for the page
 *
 * @param params - Page parameters including language
 * @returns Promise resolving to metadata object
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  // Destructure language parameter from params
  const { lang } = await params;

  // Define metadata properties
  const title = 'OneEntry Shop';
  const description = 'OneEntry next-js shop';

  // Define alternate languages for the page
  const alternates: Metadata['alternates'] = {
    languages: Object.fromEntries(i18n.locales.map((l) => [l, `/${l}`])),
    canonical: `/${lang}`,
  };

  // Return metadata object
  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: `/${lang}`,
      type: 'website',
    },
  };
}
