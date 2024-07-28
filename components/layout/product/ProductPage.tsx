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
  description,
  imageSrc
}) => {
  return (
    <main className="box-border flex relative flex-col shrink-0 p-5 w-screen min-h-[100px] ml-[calc(50%_-_50vw)]" style={{ maxWidth: 1200 }}>
      <section className="box-border flex relative flex-col grow shrink-0 self-stretch p-5 mx-auto w-full max-w-[1200px] min-h-[100px]">
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
    </main>
  );
};

export default ProductPage;