import Image from 'next/image';
import type { JSX } from 'react';

/**
 * Sticker component displays a product sticker image, typically used to show badges or special offers.
 * It renders a small square container with an image if the sticker data is available.
 * The sticker may contain a title, value, and an extended object with a download link for the image.
 * @param   {object}      props                                           - Component properties
 * @param   {object}      props.sticker                                   - Sticker object containing sticker data
 * @param   {object}      props.sticker.value                             - Sticker value object with title and image information
 * @param   {string}      props.sticker.value.title                       - Sticker title used as alt text for accessibility
 * @param   {string}      props.sticker.value.value                       - Sticker value (not directly used in rendering)
 * @param   {object}      props.sticker.value.extended                    - Sticker extended object containing additional data
 * @param   {object}      props.sticker.value.extended.value              - Sticker extended value object
 * @param   {string}      props.sticker.value.extended.value.downloadLink - URL to the sticker image file
 * @returns {JSX.Element}                                                 A div container with the sticker image or empty fragment if no sticker data
 */
const Sticker = ({
  sticker,
}: {
  sticker: {
    value: {
      title: string;
      value: string;
      extended: {
        value: {
          downloadLink: string;
        };
      };
    };
  };
}): JSX.Element => {
  if (!sticker?.value) {
    return <></>;
  }

  /** Return empty fragment if no sticker value is provided */
  if (!sticker?.value) {
    return <></>;
  }

  /** Extract data from sticker */
  const title = sticker.value?.title;
  /** Extract image source from sticker's extended value or from first item in array if applicable */
  const imgSrc =
    sticker.value.extended?.value.downloadLink ||
    (Array.isArray(sticker.value) &&
      sticker.value[0]?.extended?.value.downloadLink);

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
