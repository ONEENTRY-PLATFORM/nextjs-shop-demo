import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import { type FC } from 'react';

import ProductCard from './product-card/ProductCard';

interface GridLayoutProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any;
  dict: IAttributeValues;
  pagesLimit: number;
  products: IProductsEntity[];
}

/**
 * Products grid
 * @param params
 * @param dict dictionary from server api
 * @param products Represents a product entity array of objects.
 * @param pagesLimit used for animations
 *
 * @returns Products grid
 */
const ProductsGrid: FC<GridLayoutProps> = ({
  params,
  dict,
  products,
  pagesLimit,
}) => {
  return (
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
            pagesLimit={pagesLimit}
            lang={params.lang}
            dict={dict}
          />
        );
      })}
    </div>
  );
};

export default ProductsGrid;
