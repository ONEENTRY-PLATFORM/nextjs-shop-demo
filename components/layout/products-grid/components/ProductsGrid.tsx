import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import { type FC } from 'react';

import ProductCard from './product-card/ProductCard';

interface GridLayoutProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any;
  dict: unknown;
  pagesLimit: number;
  products: IProductsEntity[];
}

const ProductsGrid: FC<GridLayoutProps> = ({ params, products, dict }) => {
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
            lang={params.lang}
            dict={dict}
          />
        );
      })}
    </div>
  );
};

export default ProductsGrid;
