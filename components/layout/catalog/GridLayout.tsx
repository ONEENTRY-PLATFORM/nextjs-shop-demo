import React from 'react';
import ProductCard from '../product/product-card/ProductCard';

interface GridLayoutProps {
  items: Array<{ id: number; data: Record<string, unknown> }>;
}

const GridItem: React.FC = () => {
  const product = {
    imageUrl: "",
    setName: "",
    itemCount: "",
    itemNames: "",
    currentPrice: 1200,
    originalPrice: 2350,
  };

  return (
    <div className="box-border flex relative flex-col shrink-0">
      <ProductCard product={product} />
    </div>
  );
};

const GridLayout: React.FC<GridLayoutProps> = ({ items }) => {
  const gridItems = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    data: {},
  }));
  
  return (
    <div className="box-border flex relative flex-col shrink-0 px-5 py-16 w-screen min-h-[100px] ml-[calc(50%_-_50vw)]">
      <section className="box-border flex relative flex-col grow shrink-0 self-stretch px-5 py-16 mx-auto w-full max-w-[1200px] min-h-[100px]">
        <div className="grid gap-5 w-full grid-cols-[repeat(auto-fill,minmax(200px,1fr))] max-md:w-full">
          {gridItems.map((item) => (
            <GridItem key={item.id} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default GridLayout;