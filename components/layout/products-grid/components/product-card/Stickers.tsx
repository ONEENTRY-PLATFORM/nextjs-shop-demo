import type { AttributeType } from 'oneentry/dist/base/utils';
import type { FC, Key } from 'react';

import Sticker from './Sticker';

interface StickersProps {
  attributeValues: AttributeType;
}

/**
 * Stickers
 *
 * @param product - Product entity object.
 * @param lang - Current language shortcode
 *
 * @returns Stickers array
 */
const Stickers: FC<StickersProps> = ({ attributeValues }) => {
  return [attributeValues?.stickers || []].map(
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
