import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IFilterParams } from 'oneentry/dist/products/productsInterfaces';
import type { JSX } from 'react';

import { getProducts, getProductsByPageUrl } from '@/app/api';
import FilterModal from '@/components/layout/filter/FilterModal';
import CardsGridAnimations from '@/components/layout/products-grid/animations/CardsGridAnimations';

import LoadMore from './components/LoadMore';
import ProductsGrid from './components/ProductsGrid';
import ProductsNotFound from './components/ProductsNotFound';

export const dynamic = 'force-dynamic';

/**
 * Products grid layout.
 * @param   {object}               props                      - Products GridLayout props.
 * @param   {object}               props.params               - params from query string.
 * @param   {object}               props.searchParams         - search params from query string.
 * @param   {string}               props.searchParams.search  - search query.
 * @param   {string}               props.searchParams.page    - current page number.
 * @param   {string}               props.searchParams.filters - filters query.
 * @param   {IAttributeValues}     props.dict                 - dictionary from server api.
 * @param   {number}               props.pagesLimit           - used for animations.
 * @param   {boolean}              props.isCategory           - is category page.
 * @returns {Promise<JSX.Element>}                            ProductsGrid component.
 */
const ProductsGridLayout = async ({
  params,
  searchParams,
  dict,
  pagesLimit,
  isCategory,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any;
  searchParams: {
    search?: string;
    page?: string;
    filters?: IFilterParams[];
  };
  dict: IAttributeValues;
  pagesLimit: number;
  isCategory?: boolean;
}): Promise<JSX.Element> => {
  const currentPage = Number(searchParams?.page) || 1;
  const { lang } = params;
  const limit =
    currentPage * pagesLimit > 0 ? currentPage * pagesLimit : pagesLimit;
  const combinedParams = { ...params, searchParams };

  // Get all products from api or get products byPageUrl
  const { error, isError, products, total } = !isCategory
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
    return (
      <ProductsNotFound lang={lang} dict={dict} {...(error && { error })} />
    );
  }

  const totalPages = Math.ceil(total / pagesLimit);
  const fromToPrices = products[0]?.additional.prices;

  return (
    <>
      <CardsGridAnimations
        className={'relative box-border flex w-full shrink-0 flex-col'}
      >
        <section className="relative mx-auto box-border flex min-h-[100px] w-full max-w-(--breakpoint-xl) shrink-0 grow flex-col self-stretch">
          <ProductsGrid
            lang={lang}
            dict={dict}
            pagesLimit={pagesLimit}
            products={products}
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
