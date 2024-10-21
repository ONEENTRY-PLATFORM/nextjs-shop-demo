import Image from 'next/image';
import type {
  IFilterParams,
  IProductsEntity,
} from 'oneentry/dist/products/productsInterfaces';
import { type FC } from 'react';

import { getProducts, getProductsByPageUrl } from '@/app/api';
import FilterModal from '@/components/layout/filter/FilterModal';
import CardsGridAnimations from '@/components/layout/products-grid/components/CardsGridAnimations';

import LoadMore from './components/LoadMore';
import ProductCard from './product-card/ProductCard';

interface GridLayoutProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any;
  searchParams?: {
    search?: string;
    page?: string;
    filters?: IFilterParams[];
  };
  dict: unknown;
  pagesLimit: number;
  isCategory?: boolean;
}

const ProductsGridLayout: FC<GridLayoutProps> = async ({
  params,
  searchParams,
  dict,
  pagesLimit,
  isCategory,
}) => {
  const currentPage = Number(searchParams?.page) || 1;

  const limit =
    currentPage * pagesLimit > 0 ? currentPage * pagesLimit : pagesLimit;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isError, products, total } = !isCategory
    ? await getProducts({
        limit: limit,
        offset: 0,
        lang: params.lang,
        params: { ...params, searchParams: searchParams },
      })
    : await getProductsByPageUrl({
        lang: params.lang,
        limit: limit,
        offset: 0,
        params: { ...params, searchParams: searchParams },
      });

  const totalPages = Math.ceil(total / limit);

  if (!products || total < 1) {
    return (
      <div className="text-center">
        <Image
          width={100}
          height={100}
          src={'/icons/cart.svg'}
          alt="..."
          className="mx-auto mb-5 size-20"
        />
        <div className="text-center text-lg">Products not found</div>
        <FilterModal
          prices={products?.[0]?.additional.prices}
          lang={params.lang}
          dict={dict}
        />
      </div>
    );
  }

  return (
    <>
      <CardsGridAnimations
        className={'relative box-border flex w-full shrink-0 flex-col'}
      >
        <section className="relative mx-auto box-border flex min-h-[100px] w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
          <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 max-md:w-full">
            {products?.map((product: IProductsEntity, index: number) => {
              if (!product.isVisible) {
                return;
              }
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  lang={params.lang}
                  dict={dict}
                />
              );
            })}
          </div>
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
