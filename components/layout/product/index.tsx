'use client';

import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';

import { LanguageEnum } from '@/app/types/enum';

import ProductAnimations from './animations/ProductAnimations';
import ProductDescription from './product-single/ProductDescription';
import ProductDetails from './product-single/ProductDetails';
import ProductImage from './product-single/ProductImageGallery';
import ProductsGroup from './ProductsGroup';
import RelatedItems from './RelatedItems';
import ReviewsSection from './ReviewsSection';
import VariationsCarousel from './variations/VariationsCarousel';

interface ProductSingleProps {
  product: IProductsEntity & {
    blocks?: Array<string>;
  };
  lang: string;
  dict: IAttributeValues;
  relatedProducts: IProductsEntity[];
  relatedProductsTotal: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  blocksData?: Record<string, any>;
}

/**
 * Product single
 *
 * @param product product entity object
 * @param lang current language shortcode
 * @param dict dictionary from server api
 * @param relatedProducts array of related products
 * @param relatedProductsTotal total number of related products
 * @param blocksData pre-fetched block data
 *
 * @returns Product single
 */
const ProductSingle: FC<ProductSingleProps> = ({
  product,
  lang,
  dict,
  relatedProducts,
  relatedProductsTotal,
  blocksData = {},
}) => {
  // Validate required props
  if (!product) {
    return (
      <section className="relative mx-auto box-border flex w-full max-w-(--breakpoint-xl) shrink-0 grow flex-col self-stretch">
        <div className="flex items-center justify-center min-h-[400px]">
          <p>Product not found</p>
        </div>
      </section>
    );
  }

  if (!lang) {
    return (
      <section className="relative mx-auto box-border flex w-full max-w-(--breakpoint-xl) shrink-0 grow flex-col self-stretch">
        <div className="flex items-center justify-center min-h-[400px]">
          <p>Language not specified</p>
        </div>
      </section>
    );
  }

  if (!dict) {
    return (
      <section className="relative mx-auto box-border flex w-full max-w-(--breakpoint-xl) shrink-0 grow flex-col self-stretch">
        <div className="flex items-center justify-center min-h-[400px]">
          <p>Dictionary not loaded</p>
        </div>
      </section>
    );
  }

  // extract data from product
  const { attributeValues, localizeInfos, blocks } = product;

  // Validate required product data
  if (!localizeInfos?.title) {
    return (
      <section className="relative mx-auto box-border flex w-full max-w-(--breakpoint-xl) shrink-0 grow flex-col self-stretch">
        <div className="flex items-center justify-center min-h-[400px]">
          <p>Invalid product data</p>
        </div>
      </section>
    );
  }

  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];

  return (
    <section className="relative mx-auto box-border flex w-full max-w-(--breakpoint-xl) shrink-0 grow flex-col self-stretch">
      <div className="flex flex-row gap-10 max-md:max-w-full max-md:gap-4 max-sm:flex-wrap">
        {/* ProductImage - col-1 */}
        <ProductAnimations
          className="relative mb-10 flex min-h-[280px] w-[30%] grow flex-col max-md:mb-4 max-md:w-4/12 max-md:max-w-[48%] max-sm:w-full max-sm:max-w-full"
          index={0}
        >
          <ProductImage alt={localizeInfos.title} product={product} />
        </ProductAnimations>

        {/* VariationsCarousel + ProductDescription - col-2 */}
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

          {/* ProductDescription */}
          <ProductDescription description={attributeValues?.description} />
        </ProductAnimations>

        {/* ProductDetails - col-3 */}
        <ProductAnimations
          className="flex w-3/12 flex-col pt-1.5 max-md:mb-10 max-md:w-4/12 max-sm:w-full"
          index={2}
        >
          <ProductDetails product={product} lang={lang} dict={dict} />
        </ProductAnimations>
      </div>

      {/* Reviews */}
      <ProductAnimations className={''} index={3}>
        <ReviewsSection dict={dict} />
      </ProductAnimations>

      {/* blocks */}
      {Array.isArray(blocks) &&
        blocks.map((block: string) => {
          if (block === 'multiply_items_offer' && blocksData[block]) {
            return (
              <ProductsGroup
                key={block}
                block={blocksData[block]}
                lang={lang}
                dict={dict}
                langCode={langCode}
              />
            );
          } else if (block === 'similar' && blocksData[block]) {
            return (
              <RelatedItems
                key={block}
                block={blocksData[block]}
                lang={lang}
                dict={dict}
                langCode={langCode}
              />
            );
          }
          return null;
        })}
    </section>
  );
};

export default ProductSingle;
