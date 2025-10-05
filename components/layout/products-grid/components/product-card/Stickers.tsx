import type { AttributeType } from 'oneentry/dist/base/utils';
import type { JSX, Key } from 'react';

import Sticker from './Sticker';

/**
 * Stickers.
 * @param   {object}        props                 - Component props.
 * @param   {AttributeType} props.attributeValues - Product attributes containing stickers.
 * @returns {JSX.Element[]}                       - Stickers array.
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
