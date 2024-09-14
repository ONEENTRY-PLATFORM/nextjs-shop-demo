import Image from 'next/image';
import type { Dispatch, SetStateAction } from 'react';

interface VariationProps {
  index: number;
  title: string;
  imageSrc: string;
  currentIndex: number;
  setCurrentIndex: Dispatch<SetStateAction<number>>;
}

const CarouselItem: React.FC<VariationProps> = ({
  title,
  imageSrc,
  index,
  currentIndex,
  setCurrentIndex,
}) => {
  const onSelect = () => {
    setCurrentIndex(index);
  };
  const isActive = index === currentIndex;

  return (
    <button
      onClick={onSelect}
      className={
        'relative rounded-lg box-border flex w-[100px] shrink-0 flex-col ' +
        (isActive
          ? 'border border-solid border-slate-200 text-slate-800'
          : 'border border-solid border-transparent text-slate-300')
      }
    >
      <div className="flex w-full flex-col gap-1 overflow-hidden whitespace-nowrap pb-1 text-center text-sm">
        <div className="h-[80px] w-full bg-neutral-100">
          <Image
            width={80}
            height={80}
            src={imageSrc}
            alt="Product"
            className="size-full shrink-0 rounded-lg object-cover"
          />
        </div>
        <h3 className="w-full text-center leading-4">{title}</h3>
      </div>
    </button>
  );
};

export default CarouselItem;
