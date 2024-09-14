import { getProductsByBlockMarker } from '@/app/api/serverSideProps';

import GroupCard from './group-card/GroupCard';

const ProductsGroup: React.FC<{
  marker: string;
}> = async ({ marker }) => {
  const data = await getProductsByBlockMarker(marker, 'en_US');

  const { isError, products } = data;
  if (isError || !products) {
    return null;
  }

  return (
    <section className="mb-8 flex flex-col max-md:max-w-full">
      <h3 className="mb-5 text-base uppercase leading-5 text-neutral-600 max-md:max-w-full">
        These items are cheaper together
      </h3>

      <div className="flex w-full flex-row justify-between gap-2.5">
        {products?.map((product) => (
          <div
            key={product.id}
            className="relative box-border flex w-full shrink-0 flex-col md:w-[45%] xl:w-[32.5%]"
          >
            <GroupCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductsGroup;
