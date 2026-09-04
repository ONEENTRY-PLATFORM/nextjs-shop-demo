import type { JSX } from 'react';

import ProductSingleLoader from '@/components/layout/product/components/ProductSingleLoader';

/**
 * Loading skeleton for the single product route. Shown while the product data
 * is fetched on a direct load / refresh (client-side navigation is covered by
 * the transition overlay).
 *
 * Accepted trade-off: this boundary flushes the 200 shell before the page
 * resolves, so an unknown product id renders the 404 markup with a 200 status
 * rather than a real 404. The skeleton is judged worth more than the status
 * code here; do not add a `loading.tsx` to a segment where the code matters
 * without re-deciding that.
 * @returns {JSX.Element} Product page skeleton.
 */
export default function Loading(): JSX.Element {
  return (
    <div className="mx-auto flex w-full max-w-(--breakpoint-xl) flex-col bg-white">
      <ProductSingleLoader />
    </div>
  );
}
