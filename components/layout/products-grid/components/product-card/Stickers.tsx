import type { FC, Key } from 'react';

import Sticker from './Sticker';

interface StickersProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributeValues: any;
}

/**
 * Stickers
 *
 * @param product product entity object.
 * @param lang Current language shortcode
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
