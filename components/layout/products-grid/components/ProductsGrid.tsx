import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { JSX } from 'react';

import ProductCard from './product-card/ProductCard';

/**
 * Products grid.
 * @param   {object}            props            - Products grid props.
 * @param   {string}            props.lang       - language code.
 * @param   {IAttributeValues}  props.dict       - dictionary from server api.
 * @param   {IProductsEntity[]} props.products   - Represents a product entity array of objects.
 * @param   {number}            props.pagesLimit - used for animations.
 * @returns {JSX.Element}                        Products grid.
 */
const ProductsGrid = ({
  lang,
  dict,
  products,
  pagesLimit,
}: {
  lang: string;
  dict: IAttributeValues;
  pagesLimit: number;
  products: IProductsEntity[];
}): JSX.Element => {
  return (
    <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 max-md:w-full">
      {Array.isArray(products)
        ? products
            ?.filter((item) => item.isVisible)
            .map((product: IProductsEntity, index: number) => {
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  pagesLimit={pagesLimit}
                  lang={lang}
                  dict={dict}
                />
              );
            })
        : []}
    </div>
  );
};

export default ProductsGrid;
