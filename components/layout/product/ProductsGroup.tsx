import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { JSX } from 'react';

import ProductAnimations from './animations/ProductAnimations';
import GroupCard from './group-card/GroupCard';

/**
 * ProductsGroup
 * @param   {object}            props                       - The component props
 * @param   {object}            props.block                 - The block data containing products and attributes
 * @param   {object}            props.block.attributeValues - The attribute values for the block
 * @param   {IProductsEntity[]} props.block.products        - The products for the block
 * @param   {string}            props.lang                  - current language shortcode
 * @param   {IAttributeValues}  props.dict                  - dictionary from server api
 * @param   {string}            props.langCode              - The language code for attribute values
 * @returns {JSX.Element}                                   ProductsGroup
 */
const ProductsGroup = ({
  block,
  lang,
  dict,
  langCode,
}: {
  block: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    attributeValues: any;
    products?: IProductsEntity[];
  };
  lang: string;
  dict: IAttributeValues;
  langCode: string;
}): JSX.Element => {
  return (
    <ProductAnimations
      className="mb-8 flex flex-col max-md:max-w-full"
      index={4}
    >
      <h2 className="mb-5 text-base uppercase leading-5 text-neutral-600 max-md:max-w-full">
        {block?.attributeValues?.[langCode]?.together_title?.value ||
          block?.attributeValues?.together_title?.value}
      </h2>
      <div className="flex w-full flex-row flex-wrap items-stretch justify-start gap-2.5">
        {block?.products?.map((product: IProductsEntity) => (
          <div
            key={product.id}
            className="relative box-border flex w-full shrink-0 flex-col md:w-[45%] xl:w-[32.5%]"
          >
            <GroupCard product={product} lang={lang} dict={dict} />
          </div>
        ))}
      </div>
    </ProductAnimations>
  );
};

export default ProductsGroup;
