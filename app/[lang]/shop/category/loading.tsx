import type { JSX } from 'react';

import { CategoriesLoader } from '@/components/layout/categories/components/CategoriesLoader';

/**
 * Loading skeleton for the categories overview route. Shown while the category
 * pages are fetched on a direct load / refresh (client-side navigation is
 * covered by the transition overlay).
 * @returns {JSX.Element} Categories grid skeleton.
 */
export default function Loading(): JSX.Element {
  return (
    <main className="relative mx-auto box-border flex w-full max-w-(--breakpoint-xl) shrink-0 grow flex-col self-stretch">
      <div className="flex w-full flex-col items-center gap-5 bg-white">
        <CategoriesLoader />
      </div>
    </main>
  );
}
