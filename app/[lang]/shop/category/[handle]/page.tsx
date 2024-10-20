import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { type FC, Suspense } from 'react';

import { getDictionary } from '@/app/[lang]/dictionaries';
import { getBlockByMarker, getPageByUrl } from '@/app/api';
import { useServerProvider } from '@/app/store/providers/ServerProvider';
import type { MetadataParams, PageProps } from '@/app/types/global';
import ProductsGridLayout from '@/components/layout/products-grid';
import ProductsGridLoader from '@/components/layout/products-grid/ProductsGridLoader';
import type { Locale } from '@/i18n-config';

// generateMetadata
export async function generateMetadata({
  params: { handle, lang },
}: MetadataParams): Promise<Metadata> {
  const { isError, page } = await getPageByUrl(handle, lang);

  if (isError || !page) {
    return notFound();
  }
  const { localizeInfos, isVisible, attributeValues } = page;

  const {
    url,
    width,
    height,
    altText: alt,
  } = {
    url: attributeValues.icon?.downloadLink,
    width: 300,
    height: 300,
    altText: localizeInfos.title,
  };

  return {
    title: localizeInfos.title,
    description: localizeInfos.plainContent,
    robots: {
      index: isVisible,
      follow: isVisible,
      googleBot: {
        index: isVisible,
        follow: isVisible,
      },
    },
    openGraph: url
      ? {
          images: [
            {
              url,
              width,
              height,
              alt,
            },
          ],
        }
      : null,
  };
}

// CatalogPage
const CatalogPage: FC<PageProps> = async ({ params, searchParams }) => {
  const [dict] = useServerProvider(
    'dict',
    await getDictionary(params.lang as Locale),
  );
  const { lang, handle } = params;
  const { page } = await getPageByUrl(handle, lang);
  const { block } = await getBlockByMarker('main_catalog', lang);
  const pagesLimit = block?.quantity || 10;

  if (!page) {
    return notFound();
  }

  return (
    <section className="relative mx-auto box-border flex w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
      <div className="flex w-full flex-col items-center gap-5 bg-white">
        <Suspense fallback={<ProductsGridLoader />}>
          <ProductsGridLayout
            searchParams={searchParams}
            pagesLimit={pagesLimit}
            params={params}
            dict={dict}
            isCategory={true}
          />
        </Suspense>
      </div>
    </section>
  );
};

export default CatalogPage;
