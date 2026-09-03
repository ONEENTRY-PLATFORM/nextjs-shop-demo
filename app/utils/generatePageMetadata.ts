// app/utils/metadataUtils.ts
import type { Metadata } from 'next';

import { i18n } from '@/i18n-config';

import { getSiteUrl } from './getSiteUrl';

/**
 * Options for generating page metadata.
 * @interface PageMetadataOptions
 * @property {string}  [path]        - Route path of the page **after** the locale segment, e.g. `/shop/product/42`. Empty for the locale root.
 * @property {string}  title         - The title of the page.
 * @property {string}  description   - The description of the page.
 * @property {boolean} isVisible     - Whether the page is visible or not.
 * @property {string}  [imageUrl]    - The URL of the image associated with the page.
 * @property {number}  [imageWidth]  - The width of the image associated with the page. Defaults to 300.
 * @property {number}  [imageHeight] - The height of the image associated with the page. Defaults to 300.
 * @property {string}  [imageAlt]    - The alt text of the image associated with the page. Defaults to the page title.
 * @property {string}  lang          - The language code of the page.
 */
interface PageMetadataOptions {
  path?: string;
  title: string;
  description: string;
  isVisible: boolean;
  imageUrl?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageAlt?: string;
  lang: string;
}

/**
 * Generate standardized page metadata.
 * @param   {object}   props             - Metadata generation options
 * @param   {string}   props.path        - Route path after the locale segment, e.g. `/shop/product/42`. Defaults to an empty string (the locale root)
 * @param   {string}   props.title       - The title of the page
 * @param   {string}   props.description - The description of the page
 * @param   {boolean}  props.isVisible   - Whether the page is visible or not
 * @param   {string}   props.imageUrl    - The URL of the image associated with the page
 * @param   {number}   props.imageWidth  - The width of the image associated with the page. Defaults to 300
 * @param   {number}   props.imageHeight - The height of the image associated with the page. Defaults to 300
 * @param   {string}   props.imageAlt    - The alt text of the image associated with the page. Defaults to the page title
 * @param   {string}   props.lang        - The language code of the page
 * @returns {Metadata}                   Metadata object
 */
export const generatePageMetadata = ({
  path = '',
  title,
  description,
  isVisible,
  imageUrl,
  imageWidth = 300,
  imageHeight = 300,
  imageAlt,
  lang,
}: PageMetadataOptions): Metadata => {
  // Validate language parameter
  if (!lang) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found',
    };
  }

  /** Site origin — never the CMS API host, see {@link getSiteUrl} */
  const siteUrl = getSiteUrl();

  /**
   * Path part shared by the canonical URL and every language alternate.
   *
   * The caller passes the route path **without** the locale, which is added
   * here once. The previous `baseUrl` + `handle` pair built it twice over: a
   * caller that passed the full path in `baseUrl` and the same segment again in
   * `handle` produced `/en/en/shop/product/42//42`, while the pages that had no
   * `[handle]` segment at all fell back to `''` and pointed three different
   * routes — home, `/shop` and `/shop/category` — at one canonical.
   *
   * Normalized rather than trusted: a leading slash is added when missing and a
   * trailing one dropped, so `${siteUrl}/${lang}${suffix}` never doubles a
   * separator regardless of how the caller spells the path.
   */
  const suffix = path ? `/${path.replace(/^\/+/, '').replace(/\/+$/, '')}` : '';

  return {
    /**
     * An empty description must not be emitted: Next treats `description: ''`
     * as an override and drops the layout's default, which left the home page
     * with no `<meta name="description">` at all (Lighthouse SEO flags it).
     * Omitting the key lets the layout value through.
     */
    title,
    ...(description ? { description } : {}),
    alternates: {
      canonical: `${siteUrl}/${lang}${suffix}`,
      languages: Object.fromEntries(
        i18n.locales.map((lng, i) => [
          i18n.localesData[i],
          `${siteUrl}/${lng}${suffix}`,
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
