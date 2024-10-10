import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC, Key } from 'react';

import { getBlockByMarker } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';

import ProductCard from '../catalog/product-card/ProductCard';

const RelatedItems: FC<{
  marker: string;
  lang: string;
}> = async ({ marker, lang }) => {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  const { isError, block } = await getBlockByMarker(marker, lang);
  if (isError || !block || !block.similarProducts) {
    return null;
  }
  const title =
    block.attributeValues[langCode]?.block_title?.value ||
    block.attributeValues?.block_title?.value;

  return (
    <section className="flex flex-col max-md:max-w-full">
      <h3 className="mb-5 text-base uppercase leading-5 text-neutral-600 max-md:max-w-full">
        {title}
      </h3>
      <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 max-md:w-full">
        {block.similarProducts.map((product: IProductsEntity, i: Key) => {
          return <ProductCard key={i} lang={lang} product={product} />;
        })}
      </div>
    </section>
  );
};

export default RelatedItems;
