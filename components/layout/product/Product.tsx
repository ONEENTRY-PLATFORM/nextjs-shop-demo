import React from 'react';

import ProductDescription from './ProductDescription';
import ProductDetails from './ProductDetails';
import ProductImage from './ProductImage';

interface ProductProps {
  product: {
    productName: string;
    productType: string;
    price: number;
    stock: number;
    description: string;
    imageSrc: string;
  };
}

const Product: React.FC<ProductProps> = ({ product }) => {
  const {
    productName,
    productType,
    price,
    stock,
    description = 'Text description',
    imageSrc,
  } = product;

  return (
    <div className="mb-16 flex flex-row gap-10 max-md:max-w-full max-md:flex-wrap">
      <ProductImage imageSrc={imageSrc} />
      <ProductDescription description={description} />
      <ProductDetails
        productName={productName}
        productType={productType}
        price={price}
        stock={stock}
      />
    </div>
  );
};

export default Product;
