import React from 'react';

import CarouselItem from './CarouselItem';
import NavigationButton from './NavigationButton';

const items = [
  {
    title: 'Red',
    imageSrc: '/images/catalog-img-4.svg',
  },
  {
    title: 'Blue',
    imageSrc: '/images/catalog-img-4.svg',
  },
  {
    title: 'Green',
    imageSrc: '/images/catalog-img-4.svg',
  },
  {
    title: 'Yellow',
    imageSrc: '/images/catalog-img-4.svg',
  },
];

const VariationsCarousel: React.FC = () => {
  return (
    <nav className="flex w-full items-center justify-center gap-3 self-stretch">
      <NavigationButton direction="left" />
      <div className="flex gap-1.5 self-stretch">
        {items.map((item, idx) => (
          // eslint-disable-next-line react/no-array-index-key
          <CarouselItem key={idx} title={item.title} imageSrc={item.imageSrc} />
        ))}
      </div>
      <NavigationButton direction="right" />
    </nav>
  );
};

export default VariationsCarousel;
