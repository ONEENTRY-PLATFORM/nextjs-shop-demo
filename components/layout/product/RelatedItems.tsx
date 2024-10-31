import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC, Key } from 'react';

import { getBlockByMarker } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';

import ProductCard from '../products-grid/components/product-card/ProductCard';

interface RelatedItemsProps {
  marker: string;
  lang: string;
  dict: IAttributeValues;
}

const RelatedItems: FC<RelatedItemsProps> = async ({ marker, lang, dict }) => {
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
        {block.similarProducts.map(
          (product: IProductsEntity, i: Key | number) => {
            return (
              <ProductCard
                key={i}
                lang={lang}
                product={product}
                dict={dict}
                index={i as number}
              />
            );
          },
        )}
      </div>
    </section>
  );
};

export default RelatedItems;
