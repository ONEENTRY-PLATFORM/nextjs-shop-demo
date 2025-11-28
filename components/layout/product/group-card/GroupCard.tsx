import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { JSX } from 'react';

import { LanguageEnum } from '@/app/types/enum';

import ApplyButton from './ApplyButton';
import PriceDisplay from './PriceDisplay';
import ProductImage from './ProductImage';

/**
 * Products group card component.
 * Displays a product group card with product information, images, price and apply button.
 * Handles localization of product information and displays multiple product images.
 * Provides functionality to add/remove products from cart through the ApplyButton component.
 * @param   {object}           props         - Component properties.
 * @param   {IProductsEntity}  props.product - Product entity object containing product information.
 * @param   {string}           props.lang    - Current language shortcode for localization.
 * @param   {IAttributeValues} props.dict    - Dictionary from server API containing localized text values.
 * @returns {JSX.Element}                    - Rendered products group card component.
 */
const GroupCard = ({
  product,
  lang,
  dict,
}: {
  product: IProductsEntity;
  lang: string;
  dict: IAttributeValues;
}): JSX.Element => {
  /** Map language code to enum value for attribute values */
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];

  /** Get attribute values for the current language or fallback to default */
  const attributeValues =
    product.attributeValues[langCode] || product.attributeValues;

  /** Get localized product title or fallback to default */
  const title =
    product.localizeInfos[langCode]?.title || product.localizeInfos?.title;

  /** Extract product images from attribute values */
  const images =
    attributeValues.more_pic?.value || attributeValues.more_pic?.value;

  /** Get first product image download link */
  const pic1 = images && images[0].downloadLink;

  /** Get second product image download link */
  const pic2 = images && images[1].downloadLink;

  return (
    <div className="flex min-h-[182px] flex-row justify-between rounded-xl bg-[#F6F7F9] p-4 transition-shadow hover:shadow-lg max-md:flex-col">
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
          {pic1 && <ProductImage imageSrc={pic1} />}
          <div className="my-auto aspect-square w-4 shrink-0 fill-neutral-600 text-center">
            +
          </div>
          {pic2 && <ProductImage imageSrc={pic2} />}
        </div>
      </div>
    </div>
  );
};

export default GroupCard;
