import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IFilterParams } from 'oneentry/dist/products/productsInterfaces';
import { type FC } from 'react';

import { getProducts, getProductsByPageUrl } from '@/app/api';
import FilterModal from '@/components/layout/filter/FilterModal';
import CardsGridAnimations from '@/components/layout/products-grid/animations/CardsGridAnimations';

import LoadMore from './components/LoadMore';
import ProductsGrid from './components/ProductsGrid';
import ProductsNotFound from './components/ProductsNotFound';

interface GridLayoutProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any;
  searchParams?: {
    search?: string;
    page?: string;
    filters?: IFilterParams[];
  };
  dict: IAttributeValues;
  pagesLimit: number;
  isCategory?: boolean;
}

/**
 * ProductsGrid layout
 * @param params
 * @param searchParams
 * @param dict dictionary from server api
 * @param pagesLimit used for animations
 * @param isCategory
 *
 * @returns ProductsGrid layout
 */
const ProductsGridLayout: FC<GridLayoutProps> = async ({
  params,
  searchParams,
  dict,
  pagesLimit,
  isCategory,
}) => {
  const currentPage = Number(searchParams?.page) || 1;
  const lang = params.lang;
  const limit =
    currentPage * pagesLimit > 0 ? currentPage * pagesLimit : pagesLimit;

  // Get all products from api or get products byPageUrl
  const { isError, products, total } = !isCategory
    ? await getProducts({
        lang: lang,
        limit: limit,
        offset: 0,
        params: { ...params, searchParams: searchParams },
      })
    : await getProductsByPageUrl({
        lang: lang,
        limit: limit,
        offset: 0,
        params: { ...params, searchParams: searchParams },
      });

  const totalPages = Math.ceil(total / pagesLimit);

  if (!products || total < 1 || isError) {
    return <ProductsNotFound lang={lang} dict={dict} />;
  }

  return (
    <>
      <CardsGridAnimations
        className={'relative box-border flex w-full shrink-0 flex-col'}
      >
        <section className="relative mx-auto box-border flex min-h-[100px] w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
          <ProductsGrid
            params={params}
            dict={dict}
            pagesLimit={pagesLimit}
            products={products}
          />
          <div className="mt-5 flex w-full justify-center">
            {totalPages > 1 && <LoadMore totalPages={totalPages} />}
          </div>
        </section>
      </CardsGridAnimations>
      <FilterModal
        prices={products?.[0]?.additional.prices}
        lang={params.lang}
        dict={dict}
      />
    </>
  );
};

export default ProductsGridLayout;
