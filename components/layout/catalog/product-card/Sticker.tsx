import Image from 'next/image';

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

const Sticker: React.FC<IconButtonProps> = ({ sticker }) => {
  if (!sticker?.value) {
    return;
  }

  return (
    <button
      type="button"
      className="relative box-border flex size-[26px] shrink-0 flex-col items-center justify-center"
    >
      <Image
        width={24}
        height={24}
        loading="lazy"
        src={sticker.value.extended.value.downloadLink}
        alt={sticker.value.title}
        className="relative shrink-0"
      />
    </button>
  );
};

export default Sticker;
