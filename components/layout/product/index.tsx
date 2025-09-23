import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';

import { getRelatedProductsById } from '@/app/api';

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
    productPages?: [];
  };
  lang: string;
  dict: IAttributeValues;
}

/**
 * Product single
 *
 * @param product product entity object
 * @param lang current language shortcode
 * @param dict dictionary from server api
 *
 * @returns Product single
 */
const ProductSingle: FC<ProductSingleProps> = async ({
  product,
  lang,
  dict,
}) => {
  // extract data from product
  const { attributeValues, localizeInfos, blocks, id } = product;

  // Get all related products by Id
  const { products, total } = await getRelatedProductsById(id, lang);

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
            <VariationsCarousel items={products} total={total} lang={lang} />
          </div>

          {/* ProductDescription */}
          <ProductDescription description={attributeValues.description} />
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
          if (block === 'multiply_items_offer') {
            return (
              <ProductsGroup
                key={block}
                marker={block}
                lang={lang}
                dict={dict}
              />
            );
          } else if (block === 'similar') {
            return (
              <RelatedItems
                key={block}
                marker={block}
                lang={lang}
                dict={dict}
              />
            );
          }
        })}
    </section>
  );
};

export default ProductSingle;
