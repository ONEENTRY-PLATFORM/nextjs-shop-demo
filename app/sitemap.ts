import type { MetadataRoute } from 'next';

import { i18n } from '@/i18n-config';

const getBaseUrl = () => {
  const envUrl =
    process.env.NEXT_PUBLIC_PROJECT_URL || process.env.NEXT_PUBLIC_VERCEL_URL;
  if (!envUrl) return 'http://localhost:3000';
  return envUrl.replace(/\/$/, '');
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();

  // Base pages by locales
  const localizedRoots = i18n.locales.map((loc) => ({
    url: `${baseUrl}/${loc}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1,
  }));

  // Known sections
  const sections = ['shop', 'orders', 'favorites', 'cart'];
  const localizedSections = i18n.locales.flatMap((loc) =>
    sections.map((s) => ({
      url: `${baseUrl}/${loc}/${s}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    })),
  );

  // Here you can add products/pages from the CMS (via API) and return a list of links
  // For example: const products = await api.Products.getAllHandles();
  // and then create an array of handles

  return [...localizedRoots, ...localizedSections];
}
