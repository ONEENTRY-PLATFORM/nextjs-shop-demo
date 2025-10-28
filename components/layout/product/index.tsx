/* eslint-disable jsdoc/reject-any-type */
'use client';

import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { JSX } from 'react';

import { getProductTitle } from '@/app/api/hooks/useProductsData';
import { CurrencyEnum, LanguageEnum } from '@/app/types/enum';

import ProductAnimations from './animations/ProductAnimations';
import ProductDescription from './product-single/ProductDescription';
import ProductDetails from './product-single/ProductDetails';
import ProductImageGallery from './product-single/ProductImageGallery';
import ProductsGroup from './ProductsGroup';
import RelatedItems from './RelatedItems';
import ReviewsSection from './ReviewsSection';
import VariationsCarousel from './variations/VariationsCarousel';

/**
 * ProductSingle component displays a complete product page with images, variations,
 * description, details, reviews, and related products.
 * It organizes the product information in a three-column layout on larger screens
 * and stacks the sections on smaller screens.
 * @param   {object}                                       props                      - Component properties
 * @param   {IProductsEntity & { blocks?: Array<string> }} props.product              - Product entity object containing all product information
 * @param   {string}                                       props.lang                 - Current language shortcode for localization
 * @param   {IAttributeValues}                             props.dict                 - Dictionary of attribute values from server API
 * @param   {IProductsEntity[]}                            props.relatedProducts      - Array of related products to display
 * @param   {number}                                       props.relatedProductsTotal - Total number of related products
 * @param   {Record<string, any>}                          [props.blocksData]         - Pre-fetched block data for dynamic content
 * @returns {JSX.Element}                                                             A complete product page with all relevant information and sections
 */
const ProductSingle = ({
  product,
  lang,
  dict,
  relatedProducts,
  relatedProductsTotal,
  blocksData,
}: {
  product: IProductsEntity & {
    blocks?: Array<string>;
  };
  lang: string;
  dict: IAttributeValues;
  relatedProducts: IProductsEntity[];
  relatedProductsTotal: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  blocksData?: Record<string, any>;
}): JSX.Element => {
  /** Extract necessary data from product entity */
  const { attributeValues, blocks } = product;

  /** Get the formatted product title using helper function */
  const productTitle = getProductTitle(product);

  /** Convert language shortcode to language code using enum */
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  const currencyCode = CurrencyEnum[lang as keyof typeof CurrencyEnum];

  /** Create a mock block object with similar products data for the RelatedItems component */
  const relatedItemsBlock = {
    attributeValues: {},
    similarProducts: {
      items: relatedProducts,
    },
  };

  return (
    <section className="relative mx-auto box-border flex w-full max-w-(--breakpoint-xl) shrink-0 grow flex-col self-stretch">
      <div className="flex flex-row gap-10 max-md:max-w-full max-md:gap-4 max-sm:flex-wrap">
        {/** ProductImage - col-1 */}
        <ProductAnimations
          className="relative mb-10 flex min-h-[280px] w-[30%] grow flex-col max-md:mb-4 max-md:w-4/12 max-md:max-w-[48%] max-sm:w-full max-sm:max-w-full"
          index={0}
        >
          <ProductImageGallery product={product} alt={productTitle} />
        </ProductAnimations>

        {/** VariationsCarousel + ProductDescription - col-2 */}
        <ProductAnimations
          className="flex w-4/12 grow flex-col max-md:w-4/12 max-sm:w-full"
          index={1}
        >
          <div className="relative mb-6 box-border flex shrink-0 flex-col">
            <VariationsCarousel
              items={relatedProducts}
              total={relatedProductsTotal}
              lang={lang}
            />
          </div>

          {/** ProductDescription */}
          <ProductDescription description={attributeValues?.description} />
        </ProductAnimations>

        {/** ProductDetails - col-3 */}
        <ProductAnimations
          className="flex w-3/12 flex-col pt-1.5 max-md:mb-10 max-md:w-4/12 max-sm:w-full"
          index={2}
        >
          <ProductDetails product={product} lang={lang} dict={dict} />
        </ProductAnimations>
      </div>

      {/** Reviews */}
      <ProductAnimations className={''} index={3}>
        <ReviewsSection dict={dict} />
      </ProductAnimations>

      {/** blocks */}
      {Array.isArray(blocks) &&
        blocks.map((block: string) => {
          if (
            block === 'multiply_items_offer' &&
            blocksData &&
            blocksData[block]
          ) {
            return (
              <ProductsGroup
                key={block}
                block={blocksData[block]}
                lang={currencyCode}
                dict={dict}
              />
            );
          }
          return null;
        })}

      {/** Related products */}
      <ProductAnimations className={'mb-10'} index={4}>
        <RelatedItems
          block={relatedItemsBlock}
          lang={lang}
          dict={dict}
          langCode={langCode}
        />
      </ProductAnimations>
    </section>
  );
};

export default ProductSingle;
