/* eslint-disable @typescript-eslint/no-unused-vars */
import type { FC } from 'react';

import { getBlockByMarker } from '@/app/api';

import ProductCard from '../catalog/product-card/ProductCard';

const RelatedItems: FC<{
  id: number;
  marker: string;
}> = async ({ id, marker }) => {
  const langCode = 'en_US';
  const { isError, block } = await getBlockByMarker({
    marker: marker,
    langCode: langCode,
  });

  if (isError || !block) {
    return null;
  }

  return (
    <section className="flex flex-col max-md:max-w-full">
      <h3 className="mb-5 text-base uppercase leading-5 text-neutral-600 max-md:max-w-full">
        {block.localizeInfos.title}
      </h3>

      <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 max-md:w-full">
        {block.similarProducts?.map((product, i) => {
          return <ProductCard key={i} {...product} />;
        })}
      </div>
    </section>
  );
};

export default RelatedItems;
