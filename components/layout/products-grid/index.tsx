import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import { type FC } from 'react';

import FilterModal from '@/components/layout/filter/FilterModal';
import CardsGridAnimations from '@/components/layout/products-grid/animations/CardsGridAnimations';

import LoadMore from './components/LoadMore';
import ProductsGrid from './components/ProductsGrid';
import ProductsNotFound from './components/ProductsNotFound';

interface GridLayoutProps {
  /** Page parameters including language and other route parameters */
  params: {
    lang: string;
    [key: string]: string | undefined;
  };
  /** Search parameters from query string including page, search, and filters */
  currentPage?: number;
  /** Dictionary of localized strings from server API */
  dict: IAttributeValues;
  /** Maximum number of products to display per page */
  pagesLimit: number;
  /** Flag indicating if this is a category page (default: false) */
  isCategory?: boolean;
  /** Products data */
  productsData: {
    isError: boolean;
    products: IProductsEntity[];
    total: number;
  };
}

/**
 * ProductsGridLayout component that manages the overall product grid display
 *
 * This is the main component for displaying products in a grid layout. It handles
 * data fetching, pagination, and orchestrates the display of products, pagination
 * controls, and filter modal. It supports both regular product listings and
 * category-specific product listings.
 *
 * @param params - Page parameters including language and other route parameters
 * @param currentPage
 * @param dict - Dictionary of localized strings from server API
 * @param pagesLimit - Maximum number of products to display per page
 * @param isCategory - Flag indicating if this is a category page (default: false)
 * @param productsData - Pre-fetched products data
 * @returns Complete product grid layout with products, pagination, and filters
 */
const ProductsGridLayout: FC<GridLayoutProps> = ({
  params,
  currentPage,
  dict,
  pagesLimit,
  productsData,
}) => {
  const { isError, products, total } = productsData;

  const { lang } = params;

  if (!products || total < 1 || isError) {
    return <ProductsNotFound lang={lang} dict={dict} />;
  }

  const totalPages = Math.ceil(total / pagesLimit);
  const fromToPrices = products[0]?.additional.prices;

  return (
    <>
      <CardsGridAnimations
        className={'relative box-border flex w-full shrink-0 flex-col'}
      >
        <section className="relative mx-auto box-border flex min-h-[320px] w-full max-w-(--breakpoint-xl) shrink-0 grow flex-col self-stretch">
          <ProductsGrid
            lang={lang}
            dict={dict}
            pagesLimit={pagesLimit}
            products={products}
            currentPage={currentPage as number}
          />
          {totalPages > 1 && (
            <div className="mt-5 flex w-full justify-center">
              <LoadMore totalPages={totalPages} />
            </div>
          )}
        </section>
      </CardsGridAnimations>
      <FilterModal prices={fromToPrices} lang={lang} dict={dict} />
    </>
  );
};

export default ProductsGridLayout;
