import React from 'react';

import Product from '../product/Product';
import ProductsGroup from '../product/ProductsGroup';
import RelatedItems from '../product/RelatedItems';

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
      <Product />
      <ProductsGroup
        title="These items are cheaper together"
        productsGroup={productsGroup}
      />
      <RelatedItems title="Features" relatedItems={relatedItems} />
    </section>
  );
};

export default ProductPage;
