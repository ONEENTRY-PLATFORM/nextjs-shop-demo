import Image from 'next/image';

interface IconButtonProps {
  sticker: {
    value: {
      title: string;
      value: string;
    };
  };
}

const IconButton: React.FC<IconButtonProps> = ({ sticker }) => {
  console.log(sticker.value.value);

  return (
    <button
      type="button"
      className="relative box-border flex aspect-square size-[26px] shrink-0 flex-col"
    >
      <Image
        fill
        loading="lazy"
        src={'/icons/' + sticker.value.value + '.svg'}
        alt={sticker.value.title}
        className="shrink-0"
      />
    </button>
  );
};

export default IconButton;
