import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getPageByUrl } from '../../api/serverSideProps';

async function pageMetadata(handle: string): Promise<Metadata> {
  const data = await getPageByUrl(handle, 'en_US');
  const { isError, page } = data;

  if (isError || !page) {
    return notFound();
  }
  const { localizeInfos, isVisible, attributeValues } = page;

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
    openGraph: attributeValues.icon
      ? {
          images: [
            {
              url: attributeValues.icon?.downloadLink,
              width: 300,
              height: 300,
              alt: localizeInfos.title,
            },
          ],
        }
      : null,
  };
}

export default pageMetadata;
