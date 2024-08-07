import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import React from 'react';

import ProductDescription from './ProductDescription';
import ProductDetails from './ProductDetails';
import ProductImage from './ProductImage';

interface ProductProps {
  product: IProductsEntity;
}

const ProductSingle: React.FC<ProductProps> = ({ product }) => {
  // const { title, price, availableForSale, description, featuredImage } =
  //   product;

  console.log(product);

  return (
    <div className="mb-16 flex flex-row gap-10 max-md:max-w-full max-md:flex-wrap">
      <ProductImage imageSrc={product.attributeValues?.pic?.url} />
      {/* <ProductDescription description={description} />
      <ProductDetails
        title={title}
        price={price}
        availableForSale={availableForSale}
      /> */}
    </div>
  );
};

export default ProductSingle;
