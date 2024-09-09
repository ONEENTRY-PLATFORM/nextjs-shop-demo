'use client';

import { useEffect, useState } from 'react';

import { variationsItems } from '@/components/data';

import CarouselItem from './CarouselItem';
import NavigationButton from './NavigationButton';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const VariationsCarousel: React.FC<{ items: [] }> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const prevSlide = (): void => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + variationsItems.length) % variationsItems.length,
    );
  };
  const nextSlide = (): void => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % variationsItems.length);
  };

  useEffect(() => {
    // if (!isHovered) {
    //   const interval = setInterval(() => {
    //     nextSlide();
    //   }, 3000);
    //   return () => {
    //     clearInterval(interval);
    //   };
    // }
  }, [isHovered]);

  return (
    <nav
      className="flex w-full px-10"
      onMouseOver={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex w-full items-center justify-center gap-[3%] self-stretch overflow-hidden">
        {variationsItems?.map((item, idx) => (
          <CarouselItem
            key={idx}
            title={item.title}
            imageSrc={item.imageSrc}
            index={idx}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
          />
        ))}
      </div>
      <div className="absolute left-0 top-[calc(_50%_-_20px)] w-full">
        <div className="absolute left-0">
          <NavigationButton direction="left" action={prevSlide} />
        </div>
        <div className="absolute right-0">
          <NavigationButton direction="right" action={nextSlide} />
        </div>
      </div>
    </nav>
  );
};

export default VariationsCarousel;
