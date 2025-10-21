import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { JSX } from 'react';

import ProductCard from './product-card/ProductCard';

/**
 * ProductsGrid component renders a responsive grid of product cards.
 * It takes an array of product entities and displays them in a grid layout
 * with responsive columns that adapt to different screen sizes.
 * Only visible products are displayed in the grid.
 * @param   {object}            props            - Component properties
 * @param   {string}            props.lang       - Language code for localization
 * @param   {IAttributeValues}  props.dict       - Dictionary of attribute values from server API for labels and messages
 * @param   {IProductsEntity[]} props.products   - Array of product entities to display in the grid
 * @param   {number}            props.pagesLimit - Number of items per page, used for calculating animation delays in child components
 * @returns {JSX.Element}                        A div element containing a grid of ProductCard components
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
    // Responsive grid container with min 200px columns and 1fr max columns
    <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 max-md:w-full">
      {Array.isArray(products)
        ? products
            // Filter to show only visible products
            ?.filter((item) => item.isVisible)
            // Map each product to a ProductCard component
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
