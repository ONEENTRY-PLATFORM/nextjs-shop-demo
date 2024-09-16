import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';

import ProductDescription from './product-single/ProductDescription';
import ProductDetails from './product-single/ProductDetails';
import ProductImage from './product-single/ProductImage';
import ProductsGroup from './ProductsGroup';
import RelatedItems from './RelatedItems';
import ReviewsSection from './reviews-group/ReviewSection';
import VariationsCarousel from './variations/VariationsCarousel';

const ProductSingle: FC<IProductsEntity & { blocks: Array<string> }> = (
  product,
) => {
  const { attributeValues, localizeInfos, id, blocks } = product;
  console.log(product);

  return (
    <section className="relative mx-auto box-border flex w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
      <div className="flex flex-row gap-10 max-md:max-w-full max-md:gap-4 max-sm:flex-wrap">
        <ProductImage
          imageSrc={attributeValues.pic?.value.downloadLink}
          alt={localizeInfos.title}
          product={product}
        />
        <div className="flex w-4/12 grow flex-col max-md:w-full">
          <div className="relative mb-6 box-border flex shrink-0 flex-col">
            <VariationsCarousel items={[]} />
          </div>
          <ProductDescription
            description={attributeValues.description?.value.plainValue}
          />
        </div>
        <ProductDetails {...product} />
      </div>

      <ReviewsSection />

      {Array.isArray(blocks) &&
        blocks.map((block: string) => {
          if (block === 'multiply_items_offer') {
            return (
              <span key={block}>
                <ProductsGroup marker={block} langCode={'en_US'} />
              </span>
            );
          } else if (block === 'similar') {
            return (
              <RelatedItems
                key={block}
                marker={block}
                id={id}
                title="Features"
              />
            );
          }
        })}
    </section>
  );
};

export default ProductSingle;
