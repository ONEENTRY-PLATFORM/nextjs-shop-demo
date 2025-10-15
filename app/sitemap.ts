import type { MetadataRoute } from 'next';

import { i18n } from '@/i18n-config';

/**
 * Get base URL for the website
 * @returns {string} Base URL string
 */
const getBaseUrl = (): string => {
  const envUrl =
    process.env.NEXT_PUBLIC_PROJECT_URL || process.env.NEXT_PUBLIC_VERCEL_URL;
  if (!envUrl) return 'http://localhost:3000';
  return envUrl.replace(/\/$/, '');
};

/**
 * Generate sitemap data for the website, including all localized root pages and main section pages
 * Each entry contains:
 * - url: Full URL of the page
 * - lastModified: Last modification time of the page
 * - changeFrequency: Page update frequency
 * - priority: Page priority (0-1)
 * @returns {Promise<MetadataRoute.Sitemap>} Returns a Promise that resolves to a sitemap entry array in Next.js MetadataRoute.Sitemap format
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();

  /** Generate sitemap entries for root pages of each locale with highest priority */
  const localizedRoots = i18n.locales.map((loc) => ({
    url: `${baseUrl}/${loc}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1,
  }));

  /** Known section paths */
  const sections = ['shop'];
  /** Generate sitemap entries for sections of each locale */
  const localizedSections = i18n.locales.flatMap((loc) =>
    sections.map((s) => ({
      url: `${baseUrl}/${loc}/${s}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    })),
  );

  /** Here you can add products/pages from the CMS (via API) and return a list of links */
  /** For example: const products = await api.Products.getAllHandles(); and then create an array of handles */

  return [...localizedRoots, ...localizedSections];
}
