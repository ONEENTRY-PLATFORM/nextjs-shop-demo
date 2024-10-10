import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';
import Image from 'next/image';

import FilterModal from '@/components/layout/filter/FilterModal';

import Pagination from './Pagination';
import ProductCard from './product-card/ProductCard';

interface GridLayoutProps {
  gridItems?: Array<IProductsEntity>;
  totalPages: number;
  total: number;
  lang: string;
}

const ProductsGridLayout: FC<GridLayoutProps> = ({
  gridItems,
  totalPages,
  total,
  lang,
}) => {
  if (!gridItems || total < 1) {
    return(
      <>
        <Image
          width={100}
          height={100}
          src={'/icons/cart.svg'}
          alt="..."
          className="mb-5 size-20"
        />
        <div className='not-found'>
          Products not found
        </div>
        <FilterModal prices={gridItems?.[0]?.additional.prices} />
      </>
    );
  }

  return (
    <>
      <div className="relative box-border flex w-full shrink-0 flex-col">
        <section className="relative mx-auto box-border flex min-h-[100px] w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
          <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 max-md:w-full">
            {gridItems?.map((product) => {
              if (!product.isVisible) {
                return;
              }
              return (
                <ProductCard key={product.id} product={product} lang={lang} />
              );
            })}
          </div>
          <div className="mt-5 flex w-full justify-center">
            {totalPages > 1 && <Pagination totalPages={totalPages} />}
          </div>
        </section>
      </div>
      <FilterModal prices={gridItems?.[0]?.additional.prices} />
    </>
  );
};

export default ProductsGridLayout;
