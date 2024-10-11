import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';

import { getRelatedProductsById } from '@/app/api';

import ProductDescription from './product-single/ProductDescription';
import ProductDetails from './product-single/ProductDetails';
import ProductImage from './product-single/ProductImage';
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
}

const ProductSingle: FC<ProductSingleProps> = async ({
  product,
  lang,
  dict,
}) => {
  const { attributeValues, localizeInfos, blocks, id } = product;

  const { products, total } = await getRelatedProductsById(id, lang);

  return (
    <section className="relative mx-auto box-border flex w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
      <div className="flex flex-row gap-10 max-md:max-w-full max-md:gap-4 max-sm:flex-wrap">
        <div className="relative mb-10 flex h-[280px] w-[30%] grow flex-col max-md:mb-4 max-md:w-4/12 max-md:max-w-[48%] max-sm:w-full max-sm:max-w-full">
          <ProductImage
            imageSrc={attributeValues.pic.value.downloadLink}
            alt={localizeInfos.title}
            product={product}
          />
        </div>

        <div className="flex w-4/12 grow flex-col max-md:w-4/12 max-sm:w-full">
          <div className="relative mb-6 box-border flex shrink-0 flex-col">
            <VariationsCarousel items={products} total={total} lang={lang} />
          </div>

          <ProductDescription description={attributeValues.description} />
        </div>

        <div className="flex w-3/12 flex-col pt-1.5 max-md:mb-10 max-md:w-4/12 max-sm:w-full">
          <ProductDetails product={product} lang={lang} dict={dict} />
        </div>
      </div>

      <ReviewsSection />

      {Array.isArray(blocks) &&
        blocks.map((block: string) => {
          if (block === 'multiply_items_offer') {
            return <ProductsGroup key={block} marker={block} lang={lang} />;
          } else if (block === 'similar') {
            return <RelatedItems key={block} marker={block} lang={lang} />;
          }
        })}
    </section>
  );
};

export default ProductSingle;
