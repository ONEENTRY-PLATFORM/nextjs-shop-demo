import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { JSX, Key } from 'react';

import CardsGridAnimations from '../products-grid/animations/CardsGridAnimations';
import ProductCard from '../products-grid/components/product-card/ProductCard';
import ProductAnimations from './animations/ProductAnimations';

/**
 * RelatedItems component displays a section of similar or related products.
 * It renders a titled grid of product cards based on the provided block data.
 * This component is typically used at the bottom of a product page to show related items.
 * @param   {object}            props                               - Component properties
 * @param   {object}            props.block                         - The block data containing similar products
 * @param   {IAttributeValues}  props.block.attributeValues         - The attribute values for the block, including title information
 * @param   {object}            props.block.similarProducts         - The similar products data container
 * @param   {IProductsEntity[]} [props.block.similarProducts.items] - The array of similar products to display
 * @param   {string}            props.lang                          - Current language shortcode for localization
 * @param   {IAttributeValues}  props.dict                          - Dictionary of attribute values from server API
 * @param   {string}            props.langCode                      - The language code for accessing localized attribute values
 * @returns {JSX.Element}                                           A section containing a title and a grid of related product cards, or empty fragment if no data
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
  /** Early return if essential data (block or similarProducts) is missing */
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
