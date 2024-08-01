import React from 'react';

import ProductDescription from './ProductDescription';
import ProductDetails from './ProductDetails';
import ProductImage from './ProductImage';

const product = {
  productName: 'Test',
  productType: 'productType',
  price: 2500,
  stock: 20,
  description:
    "The developers' and CMS users' vast, unique experience became the basis of HeadlessCMS OneEntry. We know what the users want, so we took into account the needs of business owners, users and developers to create our product. All the tools we've developed are aimed to improve the processes of project management.",
  imageSrc: './images/catalog-img-4.svg',
};

const Product: React.FC = () => {
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
