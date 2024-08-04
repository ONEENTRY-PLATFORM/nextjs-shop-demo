import React from 'react';

import ProductCard from '../product/product-card';

interface GridLayoutProps {
  items: Array<{ id: number; data: Record<string, unknown> }>;
}

interface ProductProps {
  product: {
    imageUrl: string;
    setName: string;
    itemCount: number;
    itemNames: string;
    currentPrice: number;
    originalPrice: number;
  };
}

const GridItem: React.FC<ProductProps> = ({ product }) => {
  return (
    <div className="relative box-border flex shrink-0 flex-col">
      <ProductCard product={product} />
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ProductsGridLayout: React.FC<GridLayoutProps> = ({ items }) => {
  const gridItems = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    data: {},
  }));
  const product = {
    imageUrl: '',
    setName: '',
    itemCount: 10,
    itemNames: '',
    currentPrice: 1200,
    originalPrice: 2350,
  };

  return (
    <div className="relative box-border flex w-screen shrink-0 flex-col px-5 py-4">
      <section className="relative mx-auto box-border flex min-h-[100px] w-full max-w-[1240px] shrink-0 grow flex-col self-stretch">
        <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 max-md:w-full">
          {gridItems.map((item) => (
            <GridItem key={item.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductsGridLayout;
