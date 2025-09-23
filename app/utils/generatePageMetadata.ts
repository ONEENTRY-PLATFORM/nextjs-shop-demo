// app/utils/metadataUtils.ts
import type { Metadata } from 'next';

import { i18n } from '@/i18n-config';

interface PageMetadataOptions {
  handle: string;
  title: string;
  description: string;
  isVisible: boolean;
  imageUrl?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageAlt?: string;
  lang: string;
  baseUrl: string;
}

/**
 * Generate standardized page metadata
 * @param options - Metadata generation options
 * @returns Next.js Metadata object
 */
export const generatePageMetadata = ({
  handle = '',
  title,
  description,
  isVisible,
  imageUrl,
  imageWidth = 300,
  imageHeight = 300,
  imageAlt,
  lang,
  baseUrl = '',
}: PageMetadataOptions): Metadata => {
  // Validate language parameter
  if (!lang) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found',
    };
  }

  return {
    title,
    description,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/${lang}${baseUrl && baseUrl + '/'}${handle && '/' + handle}`,
      languages: Object.fromEntries(
        i18n.locales.map((lng, i) => [
          i18n.localesData[i],
          `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/${lng}${baseUrl && baseUrl + '/'}${handle && '/' + handle}`,
        ]),
      ),
    },
    robots: {
      index: isVisible,
      follow: isVisible,
      googleBot: {
        index: isVisible,
        follow: isVisible,
      },
    },
    openGraph: imageUrl
      ? {
          images: [
            {
              url: imageUrl,
              width: imageWidth,
              height: imageHeight,
              alt: imageAlt || title,
            },
          ],
        }
      : null,
  };
};
