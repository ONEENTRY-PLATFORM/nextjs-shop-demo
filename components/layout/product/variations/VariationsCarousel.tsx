'use client';

import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { JSX } from 'react';
import { useState } from 'react';
import Carousel from 'react-simply-carousel';

import CarouselItem from './CarouselItem';
import NavigationButton from './NavigationButton';

/**
 * VariationsCarousel component displays a carousel of product variations.
 * If there are more than 2 products, it renders a navigable carousel with arrow buttons.
 * For 2 or fewer products, it displays them in a simple grid layout.
 * The component allows users to select different product variations visually.
 * @param   {object}                             props         - Component properties
 * @param   {Array<IProductsEntity> | undefined} props.items   - Array of product objects representing different variations
 * @param   {number}                             [props.total] - Total count of product variations
 * @param   {string}                             props.lang    - Current language shortcode for localization
 * @returns {JSX.Element}                                      A carousel or grid component displaying product variations
 * @see {@link https://github.com/vadymshymko/react-simply-carousel?tab=readme-ov-file#usage Carousel docs}
 */
const VariationsCarousel = ({
  items,
  total,
  lang,
}: {
  items: Array<IProductsEntity> | undefined;
  total?: number;
  lang: string;
}): JSX.Element => {
  /** State to track the currently selected product variation */
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  /** If no items or invalid total, render empty fragment */
  if (!items || !total || total < 1) {
    return <></>;
  }

  /** Determine if carousel mode is needed (more than 2 items) */
  const isCarousel = total > 2;
  /** Set container padding class based on carousel mode */
  const containerClass = isCarousel ? 'px-16 max-md:px-8' : '';

  return (
    <div
      className={
        'flex h-32.5 w-full items-center justify-center self-stretch ' +
        containerClass
      }
    >
      {!isCarousel ? (
        /** Render simple grid for 2 or fewer items */
        items.map((item: IProductsEntity, idx: number) => (
          <CarouselItem
            key={idx}
            item={item}
            index={idx}
            lang={lang}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
          />
        ))
      ) : (
        /** Render carousel for more than 2 items */
        <Carousel
          infinite
          showSlidesBeforeInit={false}
          containerProps={{
            style: {
              userSelect: 'none',
              justifyContent: 'center',
              overflow: 'hidden',
            },
            className:
              'flex min-w-full wrap w-full flex-row w-full justify-center items-center gap-[4%] self-stretch',
          }}
          activeSlideProps={{
            style: {},
          }}
          forwardBtnProps={{
            children: <NavigationButton direction="right" />,
            style: {
              minWidth: 30,
              alignSelf: 'center',
            },
            className:
              'absolute cursor-pointer top-[calc(50%-15px)] z-10 right-0 size-[30px] group flex aspect-square items-center justify-center rounded-full border border-neutral-200 bg-white p-2 transition-colors hover:border-orange-500',
          }}
          backwardBtnProps={{
            children: <NavigationButton direction="left" />,
            style: {
              minWidth: 30,
              alignSelf: 'center',
            },
            className:
              'absolute cursor-pointer top-[calc(50%-15px)] z-10 left-0 size-[30px] group flex aspect-square items-center justify-center rounded-full border border-neutral-200 bg-white p-2 transition-colors hover:border-orange-500',
          }}
          preventScrollOnSwipe
          swipeTreshold={60}
          activeSlideIndex={currentIndex}
          onRequestChange={setCurrentIndex}
          itemsToShow={3}
          speed={400}
          centerMode={false}
        >
          {items.map((item: IProductsEntity, idx: number) => (
            <CarouselItem
              key={idx}
              item={item}
              index={idx}
              lang={lang}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
            />
          ))}
        </Carousel>
      )}
    </div>
  );
};

export default VariationsCarousel;
