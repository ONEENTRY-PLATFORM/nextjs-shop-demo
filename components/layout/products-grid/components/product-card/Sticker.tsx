import Image from 'next/image';
import type { FC } from 'react';

interface StickerProps {
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
}

/**
 * Sticker
 * @param sticker
 *
 * @returns Sticker
 */
const Sticker: FC<StickerProps> = ({ sticker }) => {
  if (!sticker?.value) {
    return;
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
