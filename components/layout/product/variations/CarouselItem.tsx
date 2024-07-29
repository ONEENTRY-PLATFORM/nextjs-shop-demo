import React from 'react';
import VariationCard from './VariationCard';

const CarouselItem: React.FC = () => {
  return (
    <div className="box-border flex relative flex-col shrink-0 w-20">
      <VariationCard title='test' />
    </div>
  );
};

export default CarouselItem;