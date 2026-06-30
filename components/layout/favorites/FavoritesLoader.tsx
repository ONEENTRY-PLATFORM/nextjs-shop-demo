import type { JSX } from 'react';

import ProductsGridLoader from '@/components/layout/products-grid/components/ProductsGridLoader';
import WithSidebarLoader from '@/components/layout/sidebar/components/WithSidebarLoader';

/**
 * FavoritesLoader — skeleton for the favorites page. Mirrors the real layout:
 * the {@link WithSidebarLoader} (sidebar + main area) with a products grid
 * inside, which is exactly what the favorites page renders while its items
 * load.
 * @returns {JSX.Element} Animated skeleton for the favorites page.
 */
const FavoritesLoader = (): JSX.Element => {
  return (
    <WithSidebarLoader>
      <div className="flex flex-col pb-5 max-md:max-w-full">
        <ProductsGridLoader />
      </div>
    </WithSidebarLoader>
  );
};

export default FavoritesLoader;
