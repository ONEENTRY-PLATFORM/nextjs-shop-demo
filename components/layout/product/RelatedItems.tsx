import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

import ProductCard from './product-card/ProductCard';

interface RelatedItemsProps {
  title: string;
  relatedItems: Array<IProductsEntity>;
}

const RelatedItems: React.FC<RelatedItemsProps> = ({ title, relatedItems }) => {
  return (
    <section className="flex flex-col max-md:max-w-full">
      <h3 className="mb-5 text-base uppercase leading-5 text-neutral-600 max-md:max-w-full">
        {title}
      </h3>

      <div className="flex gap-4 max-lg:flex-wrap ">
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
