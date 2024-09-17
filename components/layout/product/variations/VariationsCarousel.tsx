'use client';

import type { FC } from 'react';
import { useState } from 'react';
import Carousel from 'react-simply-carousel';

import CarouselItem from './CarouselItem';
import NavigationButton from './NavigationButton';

const VariationsCarousel: FC<{
  items: Array<{
    title: string;
    imageSrc: string;
  }>;
}> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  return (
    <nav className="flex w-full">
      <div className="flex w-full items-center justify-center self-stretch">
        <Carousel
          infinite
          containerProps={{
            style: {
              width: '100%',
              justifyContent: 'space-between',
              userSelect: 'none',
            },
            className:
              'flex min-w-full w-full items-center justify-center gap-[3%] self-stretch overflow-hidden',
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
          centerMode={false}
          forwardBtnProps={{
            children: <NavigationButton direction="right" />,
            style: {
              width: 30,
              height: 30,
              minWidth: 30,
              alignSelf: 'center',
            },
            className:
              'group flex aspect-square w-8 items-center justify-center rounded-full border border-neutral-200 bg-white p-2 transition-colors hover:border-orange-500',
          }}
          backwardBtnProps={{
            children: <NavigationButton direction="left" />,
            style: {
              width: 30,
              height: 30,
              minWidth: 30,
              alignSelf: 'center',
            },
            className:
              'group flex aspect-square w-8 items-center justify-center rounded-full border border-neutral-200 bg-white p-2 transition-colors hover:border-orange-500',
          }}
        >
          {items.map((item, idx) => (
            <CarouselItem
              key={idx}
              title={item.title}
              imageSrc={item.imageSrc}
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
