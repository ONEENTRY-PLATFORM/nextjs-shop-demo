import Image from 'next/image';
import type { FC } from 'react';

interface IconButtonProps {
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

const Sticker: FC<IconButtonProps> = ({ sticker }) => {
  if (!sticker?.value) {
    return;
  }

  const title = sticker.value.title;
  const imgSrc =
    sticker.value.extended?.value.downloadLink ||
    (Array.isArray(sticker.value) &&
      sticker.value[0]?.extended?.value.downloadLink);

  return (
    <button
      type="button"
      className="relative box-border flex size-[26px] shrink-0 flex-col items-center justify-center"
    >
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
    </button>
  );
};

export default Sticker;
