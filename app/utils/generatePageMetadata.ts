// app/utils/metadataUtils.ts
import type { Metadata } from 'next';

import { i18n } from '@/i18n-config';

/**
 * Options for generating page metadata.
 * @interface PageMetadataOptions
 * @property {string}  handle        - The handle of the page.
 * @property {string}  title         - The title of the page.
 * @property {string}  description   - The description of the page.
 * @property {boolean} isVisible     - Whether the page is visible or not.
 * @property {string}  [imageUrl]    - The URL of the image associated with the page.
 * @property {number}  [imageWidth]  - The width of the image associated with the page. Defaults to 300.
 * @property {number}  [imageHeight] - The height of the image associated with the page. Defaults to 300.
 * @property {string}  [imageAlt]    - The alt text of the image associated with the page. Defaults to the page title.
 * @property {string}  lang          - The language code of the page.
 * @property {string}  baseUrl       - The base URL of the page.
 */
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
 * Generate standardized page metadata.
 * @param   {object}   props             - Metadata generation options
 * @param   {string}   props.handle      - The handle of the page
 * @param   {string}   props.title       - The title of the page
 * @param   {string}   props.description - The description of the page
 * @param   {boolean}  props.isVisible   - Whether the page is visible or not
 * @param   {string}   props.imageUrl    - The URL of the image associated with the page
 * @param   {number}   props.imageWidth  - The width of the image associated with the page. Defaults to 300
 * @param   {number}   props.imageHeight - The height of the image associated with the page. Defaults to 300
 * @param   {string}   props.imageAlt    - The alt text of the image associated with the page. Defaults to the page title
 * @param   {string}   props.lang        - The language code of the page
 * @param   {string}   props.baseUrl     - The base URL of the page. Defaults to an empty string
 * @returns {Metadata}                   Metadata object
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
