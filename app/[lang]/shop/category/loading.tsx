import type { JSX } from 'react';

import { CategoriesLoader } from '@/components/layout/categories/components/CategoriesLoader';

/**
 * Loading skeleton for the categories overview route. Shown while the category
 * pages are fetched on a direct load / refresh (client-side navigation is
 * covered by the transition overlay).
 *
 * Accepted trade-off: this boundary flushes the 200 shell before the page
 * resolves, so the sibling `notFound()` renders 404 markup under a 200 status.
 * The skeleton is judged worth more than the status code here; do not add a
 * `loading.tsx` to a segment where the code matters without re-deciding that.
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
