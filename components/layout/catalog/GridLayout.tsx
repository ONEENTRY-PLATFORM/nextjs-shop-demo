import React from 'react';

import ProductCard from '../product/product-card';

interface GridLayoutProps {
  items: Array<{ id: number; data: Record<string, unknown> }>;
}

const GridItem: React.FC = () => {
  const product = {
    imageUrl: '',
    setName: '',
    itemCount: 10,
    itemNames: '',
    currentPrice: 1200,
    originalPrice: 2350,
  };

  return (
    <div className="relative box-border flex shrink-0 flex-col">
      <ProductCard product={product} />
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const GridLayout: React.FC<GridLayoutProps> = ({ items }) => {
  const gridItems = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    data: {},
  }));

  return (
    <div className="relative ml-[calc(50%_-_50vw)] box-border flex min-h-[100px] w-screen shrink-0 flex-col px-5 py-16">
      <section className="relative mx-auto box-border flex min-h-[100px] w-full max-w-[1200px] shrink-0 grow flex-col self-stretch px-5 py-16">
        <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 max-md:w-full">
          {gridItems.map((item) => (
            <GridItem key={item.id} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default GridLayout;
