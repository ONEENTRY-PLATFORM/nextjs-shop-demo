/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  // getRelatedProductsById,
  getSimilarProducts,
} from '@/app/api/serverSideProps';

import ProductCard from '../catalog/product-card/ProductCard';

const RelatedItems: React.FC<{
  id: number;
  marker: string;
  title: string;
}> = async ({ id, marker, title }) => {
  const { isError, products } = await getSimilarProducts(marker, 'en_US');
  // !!!
  // const related = await getRelatedProductsById(id, 'en_US');
  // console.log(related);

  if (isError || !products) {
    return null;
  }

  return (
    <section className="flex flex-col max-md:max-w-full">
      <h3 className="mb-5 text-base uppercase leading-5 text-neutral-600 max-md:max-w-full">
        {title}
      </h3>

      <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 max-md:w-full">
        {products.map((product, i) => {
          return <ProductCard key={i} {...product} />;
        })}
      </div>
    </section>
  );
};

export default RelatedItems;
