import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

import ProductCard from './product-card/ProductCard';

const RelatedItems = (relatedItems: Array<IProductsEntity>) => {
  return (
    <section className="flex flex-col max-md:max-w-full">
      <h3 className="mb-5 text-base uppercase leading-5 text-neutral-600 max-md:max-w-full">
        Features
      </h3>

      <div className="flex gap-5 max-lg:flex-wrap ">
        {relatedItems.map((product, i) => (
          <div
            key={i}
            className="relative box-border flex w-[calc(_20%_-_1rem_)] shrink-0 flex-col max-xl:w-[calc(_33.3333333%_-_1rem_)] max-md:w-[calc(_50%_-_1rem_)] max-sm:w-full"
          >
            <ProductCard {...product} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default RelatedItems;
