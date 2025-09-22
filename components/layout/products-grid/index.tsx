import type { IAttributeValues } from 'oneentry/dist/base/utils';
import { type FC } from 'react';

import { getProducts, getProductsByPageUrl } from '@/app/api';
import FilterModal from '@/components/layout/filter/FilterModal';
import CardsGridAnimations from '@/components/layout/products-grid/animations/CardsGridAnimations';

import LoadMore from './components/LoadMore';
import ProductsGrid from './components/ProductsGrid';
import ProductsNotFound from './components/ProductsNotFound';

interface GridLayoutProps {
  /** Page parameters including language and other route parameters */
  params: {
    handle: string;
    lang: string;
  };
  /** Search parameters from query string including page, search, and filters */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchParams: any;
  /** Dictionary of localized strings from server API */
  dict: IAttributeValues;
  /** Maximum number of products to display per page, used for animations */
  pagesLimit: number;
  /** Flag indicating if this is a category page (default: false) */
  isCategory?: boolean;
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
 * @param searchParams - Dynamic search parameters
 * @param dict - Dictionary of localized strings from server API
 * @param pagesLimit - Maximum number of products to display per page
 * @param isCategory - Flag indicating if this is a category page (default: false)
 * @returns Complete product grid layout with products, pagination, and filters
 */
const ProductsGridLayout: FC<GridLayoutProps> = async ({
  params,
  searchParams: sp,
  dict,
  pagesLimit,
  isCategory,
}) => {
  const p = params;
  const { lang } = params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const searchParams: any = await sp;
  const currentPage = Number(searchParams?.page) || 1;
  const limit =
    currentPage * pagesLimit > 0 ? currentPage * pagesLimit : pagesLimit;
  const combinedParams = { ...p, searchParams };

  // Get all products from api or get products byPageUrl
  const { isError, products, total } = !isCategory
    ? await getProducts({
        lang: lang,
        offset: 0,
        limit: limit,
        params: combinedParams,
      })
    : await getProductsByPageUrl({
        lang: lang,
        offset: 0,
        limit: limit,
        params: combinedParams,
      });

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
