import Image from 'next/image';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import { type FC } from 'react';

import CardsGridAnimations from '@/app/animations/CardsGridAnimations';
import FilterModal from '@/components/layout/filter/FilterModal';

import LoadMore from './LoadMore';
import ProductCard from './product-card/ProductCard';

interface GridLayoutProps {
  gridItems?: Array<IProductsEntity>;
  total: number;
  limit: number;
  lang: string;
  dict: unknown;
}

const ProductsGridLayout: FC<GridLayoutProps> = async ({
  gridItems,
  total,
  limit,
  lang,
  dict,
}) => {
  const totalPages = Math.ceil(total / limit);

  if (!gridItems || total < 1) {
    return (
      <div className="text-center">
        <Image
          width={100}
          height={100}
          src={'/icons/cart.svg'}
          alt="..."
          className="mb-5 size-20"
        />
        <div className="text-center text-lg">Products not found</div>
        <FilterModal
          prices={gridItems?.[0]?.additional.prices}
          lang={lang}
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
            {gridItems?.map((product, index) => {
              if (!product.isVisible) {
                return;
              }
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  lang={lang}
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
        prices={gridItems?.[0]?.additional.prices}
        lang={lang}
        dict={dict}
      />
    </>
  );
};

export default ProductsGridLayout;
