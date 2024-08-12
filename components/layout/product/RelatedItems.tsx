import { getRelatedProductsById } from '@/app/api/serverSideProps';

import ProductCard from './product-card/ProductCard';

interface RelatedProductsProps {
  id: number;
  title: string;
}

const RelatedItems: React.FC<RelatedProductsProps> = async ({ id, title }) => {
  const data = await getRelatedProductsById(id, 'en_US');

  const { isError, products } = data;
  if (isError || !products) {
    return null;
  }

  return (
    <section className="flex flex-col max-md:max-w-full">
      <h3 className="mb-5 text-base uppercase leading-5 text-neutral-600 max-md:max-w-full">
        {title}
      </h3>

      <div className="flex gap-5 max-lg:flex-wrap ">
        {data.products?.map((product, i) => (
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
