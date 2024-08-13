import Image from 'next/image';

interface IconButtonProps {
  imgSrc: string;
}

const IconButton: React.FC<IconButtonProps> = ({ imgSrc }) => {
  return (
    <button
      type="button"
      className="relative box-border flex aspect-square size-[26px] shrink-0 flex-col"
    >
      <Image
        fill
        loading="lazy"
        src={imgSrc}
        alt=""
        className="relative shrink-0"
      />
    </button>
  );
};

export default IconButton;
