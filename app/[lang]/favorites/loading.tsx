import type { JSX } from 'react';

import ProductsGridLoader from '@/components/layout/products-grid/components/ProductsGridLoader';

/**
 * Loading component that displays a loader spinner while the page is loading.
 * This is a React functional component that renders a Loader component.
 *
 * @returns {JSX.Element} A Loader component to indicate loading state
 */
export default function Loading(): JSX.Element {
  return <ProductsGridLoader />;
}
