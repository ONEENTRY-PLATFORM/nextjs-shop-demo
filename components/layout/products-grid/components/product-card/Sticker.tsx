import Image from 'next/image';
import type { JSX } from 'react';

/**
 * Sticker.
 *
 * @param props - Sticker props.
 * @param props.sticker - Sticker object.
 * @param props.sticker.value - Sticker value object.
 * @param props.sticker.value.title - Sticker title.
 * @param props.sticker.value.value - Sticker value.
 * @param props.sticker.value.extended - Sticker extended object.
 * @param props.sticker.value.extended.value - Sticker extended value object.
 * @param props.sticker.value.extended.value.downloadLink - Sticker extended value download link.
 *
 * @returns Sticker component.
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

  // Extract data from sticker
  const title = sticker.value?.title;
  const imgSrc =
    sticker.value.extended?.value.downloadLink ||
    (Array.isArray(sticker.value) &&
      sticker.value[0]?.extended?.value.downloadLink);

  return (
    <div className="relative box-border flex size-[26px] shrink-0 flex-col items-center justify-center">
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
