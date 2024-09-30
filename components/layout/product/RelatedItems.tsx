import type { FC } from 'react';

import { getBlockByMarker } from '@/app/api';

import ProductCard from '../catalog/product-card/ProductCard';

const RelatedItems: FC<{
  marker: string;
  lang: string;
}> = async ({ marker, lang }) => {
  const { isError, block } = await getBlockByMarker(marker, lang);

  if (isError || !block || !block.similarProducts) {
    return null;
  }

  return (
    <section className="flex flex-col max-md:max-w-full">
      <h3 className="mb-5 text-base uppercase leading-5 text-neutral-600 max-md:max-w-full">
        {block.localizeInfos.title}
      </h3>
      <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 max-md:w-full">
        {block.similarProducts.map((product, i) => {
          return <ProductCard key={i} lang={lang} product={product} />;
        })}
      </div>
    </section>
  );
};

export default RelatedItems;
