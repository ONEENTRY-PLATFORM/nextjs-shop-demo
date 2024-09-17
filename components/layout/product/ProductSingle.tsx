import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';

import { getSimilarProducts } from '@/app/api/serverSideProps';
import { variationsItems } from '@/components/data';

import ProductDescription from './product-single/ProductDescription';
import ProductDetails from './product-single/ProductDetails';
import ProductImage from './product-single/ProductImage';
import ProductsGroup from './ProductsGroup';
import RelatedItems from './RelatedItems';
import ReviewsSection from './ReviewsSection';
import VariationsCarousel from './variations/VariationsCarousel';

const ProductSingle: FC<
  IProductsEntity & { blocks?: Array<string>; productPages?: [] }
> = async (product) => {
  const { attributeValues, localizeInfos, blocks } = product;

  const { products } = await getSimilarProducts('similar', 'en_US', {
    offset: 0,
    limit: 10,
  });

  return (
    <section className="relative mx-auto box-border flex w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
      <div className="flex flex-row gap-10 max-md:max-w-full max-md:gap-4 max-sm:flex-wrap">
        <div className="relative mb-10 flex h-[280px] w-[30%] grow flex-col max-md:w-full max-md:max-w-[48%] max-sm:w-full max-sm:max-w-full">
          {attributeValues.pic && (
            <ProductImage
              imageSrc={attributeValues.pic.value.downloadLink}
              alt={localizeInfos.title}
              product={product}
            />
          )}
        </div>

        <div className="flex w-4/12 grow flex-col max-md:w-full">
          <div className="relative mb-6 box-border flex shrink-0 flex-col">
            <VariationsCarousel items={products} />
          </div>

          {attributeValues.description && (
            <ProductDescription
              description={attributeValues.description.value.plainValue}
            />
          )}
        </div>

        <ProductDetails {...product} />
      </div>

      <ReviewsSection />

      {Array.isArray(blocks) &&
        blocks.map((block: string) => {
          if (block === 'multiply_items_offer') {
            return <ProductsGroup key={block} marker={block} />;
          } else if (block === 'similar') {
            return <RelatedItems key={block} marker={block} title="Features" />;
          }
        })}
    </section>
  );
};

export default ProductSingle;
