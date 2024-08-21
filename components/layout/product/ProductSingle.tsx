import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

import ProductDescription from './product-single/ProductDescription';
import ProductDetails from './product-single/ProductDetails';
import ProductImage from './product-single/ProductImage';
import RatingBlock from './rating-block/RatingBlock';
import RatingButton from './rating-block/RatingButton';
import ReviewsSection from './reviews-group/ReviewSection';
import VariationsCarousel from './variations/VariationsCarousel';

const rating = {
  rating: 4.7,
  reviewCount: 7979,
};

const ProductSingle: React.FC<IProductsEntity> = (product) => {
  const { attributeValues, localizeInfos } = product;

  return (
    <>
      <div className="flex flex-row gap-10 max-md:max-w-full max-md:flex-wrap">
        <ProductImage
          imageSrc={attributeValues.pic?.value.downloadLink}
          alt={localizeInfos.title}
        />
        <div className="flex w-4/12 grow flex-col max-md:mt-10 max-md:w-full">
          <div className="relative mb-6 box-border flex shrink-0 flex-col">
            <VariationsCarousel />
          </div>
          <ProductDescription
            description={attributeValues.description?.value.plainValue}
          />
        </div>
        <ProductDetails {...product} />
      </div>

      <div className="mb-6 flex ">
        <RatingButton {...rating} />
      </div>

      <div className="mb-16 flex justify-between">
        <ReviewsSection />
        <RatingBlock />
      </div>
    </>
  );
};

export default ProductSingle;
