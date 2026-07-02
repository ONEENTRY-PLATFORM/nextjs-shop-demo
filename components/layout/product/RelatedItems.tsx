import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { JSX } from 'react';

import { SIMILAR_PRODUCTS_PAGE_SIZE } from '@/app/api/server/blocks/getSimilarProductsByBlock';

import ProductAnimations from './animations/ProductAnimations';
import RelatedItemsGrid from './RelatedItemsGrid';

/**
 * RelatedItems component displays a section of similar or related products.
 * @param   {object}            props                               - Component properties
 * @param   {string}            props.lang                          - Current language shortcode for localization
 * @param   {IAttributeValues}  props.dict                          - Dictionary of attribute values from server API
 * @param   {number}            props.productId                     - Current product id — block rules context, excluded from the grid
 * @param   {object}            props.block                         - The block data containing similar products
 * @param   {string}            props.block.identifier              - Block marker used to load next portions
 * @param   {number}            [props.block.quantity]              - Portion size configured on the block in admin (Quantity)
 * @param   {IAttributeValues}  props.block.attributeValues         - The attribute values for the block, including title information
 * @param   {object}            props.block.similarProducts         - The similar products data container
 * @param   {IProductsEntity[]} [props.block.similarProducts.items] - The first portion of similar products
 * @param   {number}            [props.block.similarProducts.total] - Raw API total of similar products (capped by the block's quantity)
 * @returns {JSX.Element}                                           A section containing a title and a grid of related product cards, or empty fragment if no data
 */
const RelatedItems = ({
  lang,
  dict,
  block,
  productId,
}: {
  lang: string;
  dict: IAttributeValues;
  langCode: string;
  productId: number;
  block: {
    identifier: string;
    quantity?: number;
    attributeValues: IAttributeValues;
    similarProducts?: {
      items?: IProductsEntity[];
      total?: number;
    };
  };
}): JSX.Element => {
  /** Early return if essential data (block or similarProducts) is missing */
  if (!block || !block.similarProducts) {
    return <></>;
  }

  /**
   * Exclude the current product defensively — the SDK-enriched fallback list
   * (used when the productId-context re-fetch fails) may include it
   */
  const items = (block.similarProducts.items || []).filter(
    (product) => product.id !== productId,
  );

  /**
   * Portion size = the block's Quantity from admin (same formula drives the
   * server-side first fetch in ProductSingleServer), constant as a fallback
   */
  const pageSize = block.quantity || SIMILAR_PRODUCTS_PAGE_SIZE;

  return (
    <section className="flex flex-col max-md:max-w-full">
      {/* Heading */}
      <ProductAnimations className={''} index={0}>
        <h3 className="mb-5 text-base leading-5 text-neutral-600 uppercase max-md:max-w-full">
          {block?.attributeValues?.block_title?.value as string}
        </h3>
      </ProductAnimations>
      {items.length > 0 ? (
        /* Client grid with infinite scroll, seeded with the SSR portion */
        <RelatedItemsGrid
          lang={lang}
          dict={dict}
          blockMarker={block.identifier}
          productId={productId}
          pageSize={pageSize}
          initialItems={items}
          total={block.similarProducts.total ?? items.length}
        />
      ) : (
        /* Empty state text configured on the block in admin */
        <p className="text-sm text-neutral-500">
          {block?.attributeValues?.empty_releated_products?.value as string}
        </p>
      )}
    </section>
  );
};

export default RelatedItems;
