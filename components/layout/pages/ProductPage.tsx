import React from 'react';

import Product from '../product/Product';
import ProductsGroup from '../product/ProductsGroup';
import RelatedItems from '../product/RelatedItems';

const product = {
  productName: 'Test',
  productType: 'productType',
  price: 2500,
  stock: 20,
  description:
    "The developers' and CMS users' vast, unique experience became the basis of HeadlessCMS OneEntry. We know what the users want, so we took into account the needs of business owners, users and developers to create our product. All the tools we've developed are aimed to improve the processes of project management.",
  imageSrc: '/images/catalog-img-4.svg',
};

const productsGroup = [
  {
    imageUrl: '/images/catalog-img-4.svg',
    setName: 'Set Name',
    itemCount: 1,
    itemNames: '',
    currentPrice: 2500,
    originalPrice: 3200,
  },
  {
    imageUrl: '/images/catalog-img-4.svg',
    setName: 'Set Name',
    itemCount: 1,
    itemNames: '',
    currentPrice: 2500,
    originalPrice: 3200,
  },
  {
    imageUrl: '/images/catalog-img-4.svg',
    setName: 'Set Name',
    itemCount: 1,
    itemNames: '',
    currentPrice: 2500,
    originalPrice: 3200,
  },
];

const relatedItems = [
  {
    imageUrl: '/images/catalog-img-4.svg',
    setName: 'Set Name',
    itemCount: 1,
    itemNames: '',
    currentPrice: 2500,
    originalPrice: 3200,
  },
  {
    imageUrl: '/images/catalog-img-4.svg',
    setName: 'Set Name',
    itemCount: 1,
    itemNames: '',
    currentPrice: 2500,
    originalPrice: 3200,
  },
  {
    imageUrl: '/images/catalog-img-4.svg',
    setName: 'Set Name',
    itemCount: 1,
    itemNames: '',
    currentPrice: 2500,
    originalPrice: 3200,
  },
  {
    imageUrl: '/images/catalog-img-4.svg',
    setName: 'Set Name',
    itemCount: 1,
    itemNames: '',
    currentPrice: 2500,
    originalPrice: 3200,
  },
  {
    imageUrl: '/images/catalog-img-4.svg',
    setName: 'Set Name',
    itemCount: 1,
    itemNames: '',
    currentPrice: 2500,
    originalPrice: 3200,
  },
];

const ProductPage: React.FC = () => {
  return (
    <section className="relative mx-auto box-border flex w-full max-w-[1240px] shrink-0 grow flex-col self-stretch">
      <Product product={product} />
      <ProductsGroup
        title="These items are cheaper together"
        productsGroup={productsGroup}
      />
      <RelatedItems title="Features" relatedItems={relatedItems} />
    </section>
  );
};

export default ProductPage;
