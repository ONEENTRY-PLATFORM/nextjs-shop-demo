import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { JSX } from 'react';

import ProductAnimations from './animations/ProductAnimations';
import GroupCard from './group-card/GroupCard';

/**
 * ProductsGroup component displays a group of products in a grid layout.
 * It renders a section with a title and a collection of product cards.
 * This component is typically used to showcase related or recommended products.
 * @param   {object}            props                       - Component properties
 * @param   {string}            props.lang                  - Current language shortcode for localization
 * @param   {IAttributeValues}  props.dict                  - Dictionary of attribute values from server API
 * @param   {object}            props.block                 - The block data containing products and attributes
 * @param   {object}            props.block.attributeValues - The attribute values for the block, including title information
 * @param   {IProductsEntity[]} [props.block.products]      - The array of products to display in the group
 * @returns {JSX.Element}                                   A section containing a title and a grid of product cards
 */
const ProductsGroup = ({
  lang,
  dict,
  block,
}: {
  lang: string;
  dict: IAttributeValues;
  block: {
    attributeValues: IAttributeValues;
    products?: IProductsEntity[];
  };
}): JSX.Element => {
  return (
    <ProductAnimations
      className="mb-8 flex flex-col max-md:max-w-full"
      index={4}
    >
      {/* together_title */}
      <h2 className="mb-5 text-base uppercase leading-5 text-neutral-600 max-md:max-w-full">
        {block?.attributeValues?.[lang]?.together_title?.value ||
          block?.attributeValues?.together_title?.value}
      </h2>

      {/** GroupCards */}
      <div className="flex w-full flex-row flex-wrap items-stretch justify-start gap-2.5">
        {block?.products?.map((product: IProductsEntity) => (
          <div
            key={product.id}
            className="relative box-border flex w-full shrink-0 flex-col md:w-[45%] xl:w-[32.5%] h-full"
          >
            <GroupCard product={product} lang={lang} dict={dict} />
          </div>
        ))}
      </div>
    </ProductAnimations>
  );
};

export default ProductsGroup;
