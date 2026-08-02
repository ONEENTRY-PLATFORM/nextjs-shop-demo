import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { JSX } from 'react';

import ProductAnimations from './animations/ProductAnimations';
import GroupCard from './group-card/GroupCard';

/**
 * ProductsGroup component displays a group of products in a grid layout.
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
      {/* together_title — the SDK already unwraps the requested locale */}
      <h2 className="mb-5 text-base leading-5 text-neutral-600 uppercase max-md:max-w-full">
        {(block?.attributeValues?.together_title?.value as string) || ''}
      </h2>

      {/** GroupCards */}
      <div className="grid w-full auto-rows-fr grid-cols-1 gap-2.5 md:grid-cols-2 xl:grid-cols-3">
        {block?.products?.map((product: IProductsEntity) => (
          <div
            key={product.id}
            className="relative box-border flex h-full flex-col"
          >
            <GroupCard product={product} lang={lang} dict={dict} />
          </div>
        ))}
      </div>
    </ProductAnimations>
  );
};

export default ProductsGroup;
