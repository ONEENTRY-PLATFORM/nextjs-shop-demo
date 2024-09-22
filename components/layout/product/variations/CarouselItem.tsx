import clsx from 'clsx';
import Image from 'next/image';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { Dispatch, SetStateAction } from 'react';

import Placeholder from '@/components/shared/Placeholder';

interface VariationProps {
  index: number;
  item: IProductsEntity;
  currentIndex: number;
  setCurrentIndex: Dispatch<SetStateAction<number>>;
}

const CarouselItem: React.FC<VariationProps> = ({
  item,
  index,
  currentIndex,
  setCurrentIndex,
}) => {
  const onSelect = () => {
    setCurrentIndex(index);
  };
  const isActive = index === currentIndex;

  const title = item.localizeInfos.title;
  const picVal = item.attributeValues.pic.value;
  const imageSrc = Array.isArray(picVal)
    ? picVal[0]?.downloadLink
    : picVal.downloadLink;

  return (
    <button
      onClick={onSelect}
      className={
        'relative rounded-lg box-border flex w-[100px] shrink-0 flex-col ' +
        clsx(
          isActive
            ? 'border border-solid border-slate-50 text-slate-700'
            : 'border border-solid border-transparent text-slate-300',
        )
      }
    >
      <div className="flex w-full flex-col gap-1 overflow-hidden whitespace-nowrap pb-1 text-center text-sm">
        <div className="flex h-[80px] w-full items-center">
          {imageSrc ? (
            <Image
              width={80}
              height={80}
              src={imageSrc}
              alt={title}
              className="aspect-auto size-full h-auto min-w-full shrink-0 rounded-lg object-cover"
            />
          ) : (
            <Placeholder />
          )}
        </div>
        <h3 className="w-full text-center text-xs leading-4">{title}</h3>
      </div>
    </button>
  );
};

export default CarouselItem;
