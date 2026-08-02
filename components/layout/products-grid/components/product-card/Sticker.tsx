import Image from 'next/image';
import type { JSX } from 'react';

/**
 * A single selected option of the `stickers` list attribute.
 * List options come as `{ title, value, extended }`, where `extended.value`
 * holds the swatch image object for options that have one and `null` for
 * options without extended data — every access must be optional.
 * @property {string} title    - Option title, used as alt text for accessibility
 * @property {string} value    - Underlying option value (not directly used in rendering)
 * @property {object} extended - Extended payload with the sticker image, may be `{ type: null, value: null }`
 */
export type StickerOption = {
  title?: string | undefined;
  value?: string | number | null | undefined;
  extended?:
    | {
        type?: string | null | undefined;
        value?: { downloadLink?: string | undefined } | null | undefined;
      }
    | null
    | undefined;
};

/**
 * Sticker component displays a product sticker image, typically used to show badges or special offers.
 * It renders a small square container with an image if the sticker data is available.
 * @param   {object}        props         - Component properties
 * @param   {StickerOption} props.sticker - Selected list option containing sticker data
 * @returns {JSX.Element}                 A div container with the sticker image or empty fragment if no sticker data
 */
const Sticker = ({ sticker }: { sticker: StickerOption }): JSX.Element => {
  /** Return empty fragment if no sticker option is provided */
  if (!sticker) {
    return <></>;
  }

  /** Extract data from sticker option */
  const title = sticker.title;
  /** Extract image source from the option's extended value (fully optional — extended.value may be null) */
  const imgSrc = sticker.extended?.value?.downloadLink || '';

  return (
    <div className="relative box-border flex size-6.5 shrink-0 flex-col items-center justify-center">
      {imgSrc && (
        <Image
          width={24}
          height={24}
          loading="lazy"
          src={imgSrc}
          alt={title || '...'}
          className="relative shrink-0"
        />
      )}
    </div>
  );
};

export default Sticker;
