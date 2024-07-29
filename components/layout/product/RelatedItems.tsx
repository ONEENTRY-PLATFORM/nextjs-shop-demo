import React from 'react';
import ProductCard from './product-card/ProductCard';

const RelatedItems: React.FC = () => {
  return (
    <section className="flex flex-col mb-8 max-md:max-w-full">
      <h3 className="mb-5 text-base leading-5 uppercase text-neutral-600 max-md:max-w-full">
        These items are cheaper together
      </h3>
      <div className="flex flex-row gap-2.5 justify-between max-md:max-w-full">
        {[1, 2, 3].map((item) => (
          <div key={item} className="box-border flex relative flex-col shrink-0 w-[32.5%]" >
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

export default RelatedItems;