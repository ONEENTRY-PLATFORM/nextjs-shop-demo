import type { IAttributeValues } from 'oneentry/dist/base/utils';
import type { JSX } from 'react';

import type { StickerOption } from './Sticker';
import Sticker from './Sticker';

/**
 * Stickers component renders an array of product stickers.
 * The `stickers` list attribute value is an array of selected options —
 * iterate it so every selected sticker renders, not just the first one.
 * Stickers are typically used to display badges, special offers, or other product indicators.
 * @param   {object}           props                 - Component properties
 * @param   {IAttributeValues} props.attributeValues - Product attributes containing stickers data
 * @returns {JSX.Element[]}                          An array of Sticker components
 */
const Stickers = ({
  attributeValues,
}: {
  attributeValues: IAttributeValues;
}): JSX.Element[] => {
  /** Selected options of the list attribute; empty array when the attribute is absent or empty */
  const options =
    (attributeValues?.stickers?.value as StickerOption[] | undefined) ?? [];

  /** Map through selected options and create a Sticker component for each */
  return options.map((sticker, i) => {
    return <Sticker key={i} sticker={sticker} />;
  });
};

export default Stickers;
