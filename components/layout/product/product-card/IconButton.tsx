import Image from 'next/image';

interface IconButtonProps {
  iconSrc: string;
}

const IconButton: React.FC<IconButtonProps> = ({ iconSrc }) => {
  return (
    // eslint-disable-next-line jsx-a11y/control-has-associated-label
    <button
      type="button"
      className="relative box-border flex aspect-square size-[26px] shrink-0 flex-col"
    >
      <Image fill loading="lazy" src={iconSrc} alt="" className="shrink-0" />
    </button>
  );
};

export default IconButton;
