import clsx from 'clsx';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { Dispatch, JSX, SetStateAction } from 'react';

import CarouselItemImage from './CarouselItemImage';
import CarouselItemTitle from './CarouselItemTitle';

/**
 * CarouselItem.
 * @param   {object}                           props                 - Carousel item props.
 * @param   {IProductsEntity}                  props.item            - product object.
 * @param   {string}                           props.lang            - current language shortcode.
 * @param   {number}                           props.index           - index of slide.
 * @param   {number}                           props.currentIndex    - index of current slide.
 * @param   {Dispatch<SetStateAction<number>>} props.setCurrentIndex - Set state action.
 * @returns {JSX.Element}                                            CarouselItem component.
 */
const CarouselItem = ({
  item,
  lang,
  index,
  currentIndex,
  setCurrentIndex,
}: {
  item: IProductsEntity;
  lang: string;
  index: number;
  currentIndex: number;
  setCurrentIndex: Dispatch<SetStateAction<number>>;
}): JSX.Element => {
  return (
    <button
      onClick={() => setCurrentIndex(index)}
      className={
        'relative border border-solid rounded-lg box-border flex w-[100px] min-h-[130px] shrink-0 flex-col duration-500 ease-in-out ' +
        clsx(
          index === currentIndex
            ? 'border-slate-50 text-slate-700'
            : 'border-transparent text-slate-300',
        )
      }
    >
      <div className="flex w-full flex-col gap-1 overflow-hidden pb-1 text-center text-sm">
        <div className="flex h-[80px] w-full justify-center cursor-pointer">
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
