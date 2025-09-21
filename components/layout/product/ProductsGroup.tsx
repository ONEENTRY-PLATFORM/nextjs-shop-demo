import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';

import ProductAnimations from './animations/ProductAnimations';
import GroupCard from './group-card/GroupCard';

interface ProductsGroupProps {
  block: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    attributeValues: any;
    products?: IProductsEntity[];
  };
  lang: string;
  dict: IAttributeValues;
  langCode: string;
}

/**
 * ProductsGroup
 * @param block - The block data containing products and attributes
 * @param lang current language shortcode
 * @param dict dictionary from server api
 * @param langCode - The language code for attribute values
 *
 * @returns ProductsGroup
 */
const ProductsGroup: FC<ProductsGroupProps> = ({
  block,
  lang,
  dict,
  langCode,
}) => {
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
