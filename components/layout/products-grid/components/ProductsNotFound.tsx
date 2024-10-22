import Image from 'next/image';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import { type FC } from 'react';

import FilterModal from '@/components/layout/filter/FilterModal';

interface GridLayoutProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  products: IProductsEntity[] | undefined;
  lang: string;
  dict: unknown;
}

const ProductsNotFound: FC<GridLayoutProps> = async ({
  lang,
  products,
  dict,
}) => {
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
        lang={lang}
        dict={dict}
      />
    </div>
  );
};

export default ProductsNotFound;
