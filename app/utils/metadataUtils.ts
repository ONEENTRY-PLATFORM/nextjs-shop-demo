// app/utils/metadataUtils.ts
import type { Metadata } from 'next';

interface PageMetadataOptions {
  title: string;
  description: string;
  isVisible: boolean;
  imageUrl?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageAlt?: string;
  canonicalUrl: string;
  alternateUrls: Record<string, string>;
}

/**
 * Generate standardized page metadata
 * @param options - Metadata generation options
 * @returns Next.js Metadata object
 */
export const generatePageMetadata = ({
  title,
  description,
  isVisible,
  imageUrl,
  imageWidth = 300,
  imageHeight = 300,
  imageAlt,
  canonicalUrl,
  alternateUrls,
}: PageMetadataOptions): Metadata => {
  return {
    title,
    description,
    alternates: {
      languages: alternateUrls,
      canonical: canonicalUrl,
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
