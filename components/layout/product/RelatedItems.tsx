import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { JSX, Key } from 'react';

import CardsGridAnimations from '../products-grid/animations/CardsGridAnimations';
import ProductCard from '../products-grid/components/product-card/ProductCard';
import ProductAnimations from './animations/ProductAnimations';

/**
 * RelatedItems.
 * @param   {object}            props                             - Related items props.
 * @param   {object}            props.block                       - The block data containing similar products.
 * @param   {IAttributeValues}  props.block.attributeValues       - The attribute values for the block.
 * @param   {object}            props.block.similarProducts       - The similar products data.
 * @param   {IProductsEntity[]} props.block.similarProducts.items - The array of similar products.
 * @param   {string}            props.lang                        - current language shortcode.
 * @param   {IAttributeValues}  props.dict                        - dictionary from server api.
 * @param   {string}            props.langCode                    - The language code for attribute values.
 * @returns {JSX.Element}                                         RelatedItems component.
 */
const RelatedItems = ({
  block,
  lang,
  dict,
  langCode,
}: {
  block: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    attributeValues: any;
    similarProducts?: {
      items?: IProductsEntity[];
    };
  };
  lang: string;
  dict: IAttributeValues;
  langCode: string;
}): JSX.Element => {
  if (!block || !block.similarProducts) {
    return <></>;
  }

  return (
    <section className="flex flex-col max-md:max-w-full">
      <ProductAnimations className={''} index={0}>
        <h3 className="mb-5 text-base uppercase leading-5 text-neutral-600 max-md:max-w-full">
          {block?.attributeValues?.[langCode]?.block_title?.value ||
            block?.attributeValues?.block_title?.value}
        </h3>
      </ProductAnimations>
      <CardsGridAnimations className="grid w-full grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 max-md:w-full">
        {block?.similarProducts?.items?.map(
          (product: IProductsEntity, i: Key | number) => {
            return (
              <ProductCard
                key={i}
                lang={lang}
                product={product}
                dict={dict}
                index={i as number}
                pagesLimit={0}
              />
            );
          },
        )}
      </CardsGridAnimations>
    </section>
  );
};

export default RelatedItems;
