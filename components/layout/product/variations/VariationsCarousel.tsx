import React from 'react';
import CarouselItem from './CarouselItem';
import NavigationButton from './NavigationButton';


const items = ['Red', 'Blue', 'Green', 'Yellow'];

const VariationsCarousel: React.FC = () => {
  return (
    <nav className="flex gap-3 justify-center items-center self-stretch w-full">
      <NavigationButton direction="left" />
      <div className="flex gap-1.5 self-stretch">
        {items.map((item) => (
          <CarouselItem key={item} />
        ))}
      </div>
      <NavigationButton direction="right" />
    </nav>
  );
};

export default VariationsCarousel;