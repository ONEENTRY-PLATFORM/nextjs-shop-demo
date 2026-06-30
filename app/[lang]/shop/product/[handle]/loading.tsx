import type { JSX } from 'react';

import ProductSingleLoader from '@/components/layout/product/components/ProductSingleLoader';

/**
 * Loading skeleton for the single product route. Shown while the product data
 * is fetched on a direct load / refresh (client-side navigation is covered by
 * the transition overlay).
 * @returns {JSX.Element} Product page skeleton.
 */
export default function Loading(): JSX.Element {
  return (
    <div className="mx-auto flex w-full max-w-(--breakpoint-xl) flex-col bg-white">
      <ProductSingleLoader />
    </div>
  );
}
