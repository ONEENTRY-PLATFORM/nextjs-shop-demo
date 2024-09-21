'use client';

import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { FC } from 'react';
import { useState } from 'react';
import Carousel from 'react-simply-carousel';

import CarouselItem from './CarouselItem';
import NavigationButton from './NavigationButton';

const VariationsCarousel: FC<{
  items: Array<IProductsEntity> | undefined;
}> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  if (!items || items.length < 1) {
    return;
  }

  return (
    <nav className="flex w-full">
      <h2 className="w-full">Cross sells</h2>
      <div className="flex h-[110px] w-full items-center justify-center self-stretch">
        <Carousel
          infinite
          containerProps={{
            style: {
              width: '100%',
              justifyContent: 'center',
              userSelect: 'none',
            },
            className:
              'flex mx-auto min-w-full flex-col w-full items-center justify-center gap-[3%] self-stretch overflow-hidden',
          }}
          preventScrollOnSwipe
          swipeTreshold={60}
          activeSlideIndex={currentIndex}
          activeSlideProps={{
            style: {},
          }}
          onRequestChange={setCurrentIndex}
          itemsToShow={3}
          speed={400}
          centerMode={true}
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
        >
          {items?.map((item: IProductsEntity, idx: number) => (
            <CarouselItem
              key={idx}
              item={item}
              index={idx}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
            />
          ))}
        </Carousel>
      </div>
    </nav>
  );
};

export default VariationsCarousel;
