import clsx from 'clsx';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { Dispatch, FC, SetStateAction } from 'react';

import CarouselItemImage from './CarouselItemImage';
import CarouselItemTitle from './CarouselItemTitle';

interface VariationProps {
  index: number;
  lang: string;
  item: IProductsEntity;
  currentIndex: number;
  setCurrentIndex: Dispatch<SetStateAction<number>>;
}

/**
 * CarouselItem
 *
 * @param item product object
 * @param lang current language shortcode
 * @param index index of slide
 * @param currentIndex index of current slide
 * @param setCurrentIndex Set state action
 *
 * @returns Carousel card
 */
const CarouselItem: FC<VariationProps> = ({
  item,
  lang,
  index,
  currentIndex,
  setCurrentIndex,
}) => {
  const isActive = index === currentIndex;

  const onSelectHandle = () => {
    setCurrentIndex(index);
  };

  return (
    <button
      onClick={onSelectHandle}
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
          <CarouselItemImage lang={lang} item={item} />
        </div>
        <h3 className="w-full text-center text-xs leading-4">
          <CarouselItemTitle lang={lang} item={item} />
        </h3>
      </div>
    </button>
  );
};

export default CarouselItem;
