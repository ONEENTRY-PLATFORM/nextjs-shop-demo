import React from 'react';
import ProductImage from './ProductImage';
import ProductDescription from './ProductDescription';
import ProductDetails from './ProductDetails';
import RelatedItems from './RelatedItems';
import ProductFeatures from './ProductFeatures';

interface ProductPageProps {
  productName: string;
  productType: string;
  price: number;
  stock: number;
  description: string;
  imageSrc: string;
}

const ProductPage: React.FC<ProductPageProps> = ({
  productName,
  productType,
  price,
  stock,
  description = "Text description",
  imageSrc
}) => {
  return (
    <section className="box-border flex relative flex-col grow shrink-0 self-stretch mx-auto w-full max-w-[1240px]">
      <div className="flex flex-row gap-10 mb-16 max-md:pr-5 max-md:max-w-full">
        <ProductImage imageSrc={imageSrc} />
        <ProductDescription description={description} />
        <ProductDetails
          productName={productName}
          productType={productType}
          price={price}
          stock={stock}
        />
      </div>
      <RelatedItems />
      <ProductFeatures />
    </section>
  );
};

export default ProductPage;