import clsx from 'clsx';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { Dispatch, JSX, SetStateAction } from 'react';

import CarouselItemImage from './CarouselItemImage';
import CarouselItemTitle from './CarouselItemTitle';

/**
 * CarouselItem component represents a single item in a product carousel.
 * It displays a product image and title, and allows users to select the item
 * by clicking on it. The visual appearance changes based on whether the item
 * is currently selected.
 * @param   {object}                           props                 - Component properties
 * @param   {IProductsEntity}                  props.item            - Product object containing product details
 * @param   {string}                           props.lang            - Current language shortcode for localization
 * @param   {number}                           props.index           - Index of this slide in the carousel
 * @param   {number}                           props.currentIndex    - Index of the currently selected slide
 * @param   {Dispatch<SetStateAction<number>>} props.setCurrentIndex - Function to update the current slide index
 * @returns {JSX.Element}                                            A button element representing a product in the carousel
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
        'relative border border-solid rounded-lg box-border flex w-25 min-h-32.5 shrink-0 flex-col duration-500 ease-in-out ' +
        clsx(
          index === currentIndex
            ? 'border-slate-50 text-slate-700'
            : 'border-transparent text-slate-300',
        )
      }
    >
      <div className="flex w-full flex-col gap-1 overflow-hidden pb-1 text-center text-sm">
        <div className="flex h-20 w-full justify-center cursor-pointer">
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
