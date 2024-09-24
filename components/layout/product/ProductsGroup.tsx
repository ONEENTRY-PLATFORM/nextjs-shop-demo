import type { FC } from 'react';

import { getBlockByMarker } from '@/app/api';

import GroupCard from './group-card/GroupCard';

const ProductsGroup: FC<{
  marker: string;
}> = async ({ marker }) => {
  const langCode = 'en_US';
  const { isError, block } = await getBlockByMarker(marker, langCode);

  if (isError || !block) {
    return null;
  }

  return (
    <section className="mb-8 flex flex-col max-md:max-w-full">
      <h3 className="mb-5 text-base uppercase leading-5 text-neutral-600 max-md:max-w-full">
        These items are cheaper together
      </h3>

      <div className="flex w-full flex-row justify-between gap-2.5">
        {block.products?.map((product) => (
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
