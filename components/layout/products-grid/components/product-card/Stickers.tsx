import type { AttributeType } from 'oneentry/dist/base/utils';
import type { JSX, Key } from 'react';

import Sticker from './Sticker';

/**
 * Stickers.
 *
 * @param props - Component props.
 * @param props.product - Product entity object.
 * @param props.lang - Current language shortcode.
 *
 * @returns Stickers array.
 */
const Stickers = ({
  attributeValues,
}: {
  attributeValues: AttributeType;
}): JSX.Element[] => {
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
