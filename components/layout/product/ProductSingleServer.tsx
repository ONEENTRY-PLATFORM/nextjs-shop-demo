import type {
  IAttributeValues,
  IBlockEntity,
  IProductsEntity,
} from 'oneentry/types';
import type { JSX } from 'react';

import {
  getBlockByMarker,
  getRelatedProductsById,
  getSimilarProductsByBlock,
} from '@/app/api';
import { SIMILAR_PRODUCTS_PAGE_SIZE } from '@/app/api/server/blocks/getSimilarProductsByBlock';

import ProductSingle from './index';

/**
 * Server wrapper component for ProductSingle that handles all async data fetching and validation.
 * @param   {object}                                       props         - Component properties containing product data and configuration
 * @param   {IProductsEntity & { blocks?: Array<string> }} props.product - Product entity object containing all product information including optional blocks array
 * @param   {string}                                       props.lang    - Current language shortcode used for localization and API requests
 * @param   {IAttributeValues}                             props.dict    - Dictionary of attribute values from server API used for translations and labels
 * @returns {Promise<JSX.Element>}                                       A Promise that resolves to a JSX element containing the ProductSingle component
 */
const ProductSingleServer = async ({
  lang,
  dict,
  product,
}: {
  product: IProductsEntity & {
    blocks?: Array<string>;
  };
  lang: string;
  dict: IAttributeValues;
}): Promise<JSX.Element> => {
  /** Validate required props */
  if (!product || !lang || !dict) {
    return (
      <section className="relative mx-auto box-border flex w-full max-w-(--breakpoint-xl) shrink-0 grow flex-col self-stretch">
        <div className="flex min-h-100 items-center justify-center">
          {!product && (
            <p>
              {(dict?.content_not_found?.value as string) ||
                'Content not found'}
            </p>
          )}
          {!lang && <p>Language not specified</p>}
          {!dict && <p>Dictionary not loaded</p>}
        </div>
      </section>
    );
  }

  /** Extract essential product information needed for data fetching */
  const { blocks, id } = product;

  let relatedProductsData = {
    products: [] as IProductsEntity[],
    total: 0,
  };

  try {
    /** Call API to get related products by current product ID */
    const result = await getRelatedProductsById(id, lang);

    /** Process successful response - only update if no error and products exist */
    if (!result.isError && result.products) {
      relatedProductsData = {
        products: result.products,
        total: result.products.length,
      };
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Failed to load related products:', error);
  }

  const { products, total } = relatedProductsData;

  const blocksData: Record<string, IBlockEntity> = {};

  /** Only process blocks if they exist and are an array */
  if (Array.isArray(blocks)) {
    for (const blockMarker of blocks) {
      if (blockMarker === 'multiply_items_offer') {
        /** Fetch block data by marker and language */
        const { isError, block } = await getBlockByMarker(blockMarker, lang);

        /** Only add to blocksData if successful and block data exists */
        if (!isError && block) {
          blocksData[blockMarker] = block;
        }
      }
    }
  }

  /**
   * The 'similar' block is loaded for every product.
   */
  const { isError: isSimilarBlockError, block: similarBlock } =
    await getBlockByMarker('similar', lang);

  if (!isSimilarBlockError && similarBlock) {
    /** On re-fetch error the SDK-enriched (generic) list stays as a fallback */
    blocksData['similar'] = similarBlock;

    /**
     * SSR portion = the block's Quantity from admin (RelatedItems derives the
     * client portion size with the same formula, constant as a fallback)
     */
    const similar = await getSimilarProductsByBlock(
      'similar',
      lang,
      id,
      similarBlock.quantity || SIMILAR_PRODUCTS_PAGE_SIZE,
    );

    if (!similar.isError && similar.products) {
      blocksData['similar'] = {
        ...similarBlock,
        similarProducts: { items: similar.products, total: similar.total },
      };
    }
  }

  return (
    <ProductSingle
      lang={lang}
      dict={dict}
      product={product}
      relatedProducts={products as IProductsEntity[]}
      relatedProductsTotal={total}
      blocksData={blocksData}
    />
  );
};

export default ProductSingleServer;
