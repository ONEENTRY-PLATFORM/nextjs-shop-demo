import type { AttributeType } from 'oneentry/dist/base/utils';
import type { JSX, Key } from 'react';

import Sticker from './Sticker';

/**
 * Stickers component renders an array of product stickers.
 * It maps through the stickers data from product attributes and creates Sticker components for each.
 * Stickers are typically used to display badges, special offers, or other product indicators.
 * @param   {object}        props                 - Component properties
 * @param   {AttributeType} props.attributeValues - Product attributes containing stickers data
 * @returns {JSX.Element[]}                       An array of Sticker components
 */
const Stickers = ({
  attributeValues,
}: {
  attributeValues: AttributeType;
}): JSX.Element[] => {
  /** Map through stickers array and create Sticker component for each sticker */
  /** If stickers don't exist in attributeValues, use empty array as fallback */
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
