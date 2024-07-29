import React from 'react';
import ProductCard from './product-card/ProductCard';

const ProductFeatures: React.FC = () => {
  return (
    <section className="flex flex-col max-md:max-w-full">

      <h3 className="mb-5 text-base leading-5 uppercase text-neutral-600 max-md:max-w-full">
        Features
      </h3>

      <div className="flex justify-between max-md:flex-wrap">
        {[1, 2, 3, 4, 5].map((feature) => (
          <div key={feature} className="box-border flex relative flex-col shrink-0 w-[19%]">
            <ProductCard 
              imageUrl={""} 
              setName={"Set Name"} 
              itemCount={1} 
              itemNames={""} 
              currentPrice={2500} 
              originalPrice={3200} 
            />
          </div>
        ))}
      </div>

    </section>
  );
};

export default ProductFeatures;