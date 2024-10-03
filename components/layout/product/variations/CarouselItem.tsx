import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { Dispatch, SetStateAction } from 'react';

import Placeholder from '@/components/shared/Placeholder';

interface VariationProps {
  index: number;
  lang: string;
  item: IProductsEntity;
  currentIndex: number;
  setCurrentIndex: Dispatch<SetStateAction<number>>;
}

const CarouselItem: React.FC<VariationProps> = ({
  item,
  lang,
  index,
  currentIndex,
  setCurrentIndex,
}) => {
  const onSelect = () => {
    setCurrentIndex(index);
  };
  const isActive = index === currentIndex;

  const title = item.localizeInfos.title;
  const picVal = item.attributeValues.pic?.value || '';
  const imageSrc = Array.isArray(picVal)
    ? picVal[0]?.downloadLink
    : picVal.downloadLink;
  const colors = item.attributeValues?.color?.value;

  return (
    <button
      onClick={onSelect}
      className={
        'relative rounded-lg box-border flex w-[100px] min-h-[130px] shrink-0 flex-col ' +
        clsx(
          isActive
            ? 'border border-solid border-slate-50 text-slate-700'
            : 'border border-solid border-transparent text-slate-300',
        )
      }
    >
      <div className="flex w-full flex-col gap-1 overflow-hidden pb-1 text-center text-sm">
        <div className="flex h-[80px] w-full items-center">
          <Link href={'/' + lang + '/shop/product/' + item.id} title={title}>
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
          </Link>
        </div>
        <h3 className="w-full text-center text-xs leading-4">
          <Link href={'/' + lang + '/shop/product/' + item.id} title={title}>
            {colors.map((color: { title: string }, i: number) => {
              return color.title + (i < colors.length - 1 ? ' + ' : '');
            })}
          </Link>
        </h3>
      </div>
    </button>
  );
};

export default CarouselItem;
