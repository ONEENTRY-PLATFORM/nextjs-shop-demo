import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC, Key } from 'react';

import { LanguageEnum } from '@/app/types/enum';

import Sticker from './Sticker';

interface StickersProps {
  product: IProductsEntity;
  lang: string;
}

const Stickers: FC<StickersProps> = ({ product, lang }) => {
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  const { attributeValues } = product;

  const attributes = attributeValues[langCode] || attributeValues;

  return [attributes.stickers].map(
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
