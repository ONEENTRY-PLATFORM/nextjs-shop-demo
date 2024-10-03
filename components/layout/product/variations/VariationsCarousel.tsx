'use client';

import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';
import { useState } from 'react';
import Carousel from 'react-simply-carousel';

import CarouselItem from './CarouselItem';
import NavigationButton from './NavigationButton';

const VariationsCarousel: FC<{
  items: Array<IProductsEntity> | undefined;
  total: number;
  lang: string;
}> = ({ items, total, lang }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  if (!items || items.length < 1 || total < 1) {
    return;
  }

  return (
    <div className="flex h-[130px] w-full items-start justify-start self-stretch">
      <Carousel
        infinite
        containerProps={{
          style: {
            userSelect: 'none',
          },
          className:
            'flex min-w-full wrap w-full flex-row w-full justify-start justify-start gap-[3%] self-stretch overflow-hidden',
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
            'absolute top-[calc(_50%_-_15px)] z-10 right-0 size-[30px] group flex aspect-square items-center justify-center rounded-full border border-neutral-200 bg-white p-2 transition-colors hover:border-orange-500',
        }}
        backwardBtnProps={{
          children: <NavigationButton direction="left" />,
          style: {
            minWidth: 30,
            alignSelf: 'center',
          },
          className:
            'absolute top-[calc(_50%_-_15px)] z-10 left-0 size-[30px] group flex aspect-square items-center justify-center rounded-full border border-neutral-200 bg-white p-2 transition-colors hover:border-orange-500',
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
    </div>
  );
};

export default VariationsCarousel;
