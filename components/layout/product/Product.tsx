import React from 'react';

import ProductDescription from './ProductDescription';
import ProductDetails from './ProductDetails';
import ProductImage from './ProductImage';

interface ProductProps {
  product: {
    featuredImage: {
      url: string;
      width: number;
      height: number;
      altText: string;
    };
    seo: {
      title: string;
      description: string;
    };
    id: number;
    tags: string;
    title: string;
    description: string;
    availableForSale: number;
    price: number;
    priceRange: {
      minVariantPrice: {
        currencyCode: string;
        amount: number;
      };
      maxVariantPrice: {
        currencyCode: string;
        amount: number;
      };
    };
  };
}

const Product: React.FC<ProductProps> = ({ product }) => {
  const { title, price, availableForSale, description, featuredImage } =
    product;

  return (
    <div className="mb-16 flex flex-row gap-10 max-md:max-w-full max-md:flex-wrap">
      <ProductImage imageSrc={featuredImage.url} />
      <ProductDescription description={description} />
      <ProductDetails
        title={title}
        price={price}
        availableForSale={availableForSale}
      />
    </div>
  );
};

export default Product;
