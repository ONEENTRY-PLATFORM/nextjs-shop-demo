import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC, Key } from 'react';

import { LanguageEnum } from '@/app/types/enum';

import Sticker from './Sticker';

interface StickersProps {
  product: IProductsEntity;
  lang: string;
}

/**
 * Stickers
 *
 * @param product product entity object.
 * @param lang Current language shortcode
 *
 * @returns Stickers array
 */
const Stickers: FC<StickersProps> = ({
  product: { attributeValues },
  lang,
}) => {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];

  // extract attributes from attributeValues field of product
  const attributes = attributeValues[langCode] || attributeValues;

  return [attributes?.stickers || []].map(
    (
      sticker: {
        value: {
          value: string;
          title: string;
          extended: {
            value: {
              downloadLink: string;
            };
          };
        };
      },
      i: Key,
    ) => {
      return <Sticker key={i} sticker={sticker} />;
    },
  );
};

export default Stickers;
