import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';
import React from 'react';

import { LanguageEnum } from '@/app/types/enum';
import Placeholder from '@/components/shared/Placeholder';

import ApplyButton from './ApplyButton';
import PriceDisplay from './PriceDisplay';
import ProductImage from './ProductImage';

interface GroupCardProps {
  product: IProductsEntity;
  lang: string;
  dict: IAttributeValues;
}

/**
 * Products group card
 *
 * @param product product entity object
 * @param lang current language shortcode
 * @param dict dictionary from server api
 *
 * @returns Products group card
 */
const GroupCard: FC<GroupCardProps> = ({ product, lang, dict }) => {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  const attributeValues =
    product.attributeValues[langCode] || product.attributeValues;
  const title =
    product.localizeInfos[langCode]?.title || product.localizeInfos?.title;
  const images =
    attributeValues.more_pic?.value || attributeValues.more_pic?.value;
  const pic1 = images && images[0]?.downloadLink;
  const pic2 = images && images[1]?.downloadLink;

  return (
    <div className="flex min-h-[170px] flex-row justify-between rounded-xl bg-[#F6F7F9] p-4 transition-shadow hover:shadow-lg max-md:flex-col">
      <div className="flex min-w-full gap-2.5">
        <div className="flex w-[37%] flex-col">
          <h3 className="mb-5 text-sm leading-4 text-neutral-600">{title}</h3>
          <PriceDisplay
            currentPrice={attributeValues?.sale?.value}
            originalPrice={product.price as number}
            lang={lang}
          />
          <ApplyButton product={product} dict={dict} />
        </div>

        <div className="flex w-[63%] flex-row justify-between">
          {pic1 ? (
            <ProductImage imageSrc={pic1} />
          ) : (
            <Placeholder className="min-h-[110px]" />
          )}
          <div className="my-auto aspect-square w-4 shrink-0 fill-neutral-600 text-center">
            +
          </div>
          {pic2 ? (
            <ProductImage imageSrc={pic2} />
          ) : (
            <Placeholder className="min-h-[110px]" />
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupCard;
