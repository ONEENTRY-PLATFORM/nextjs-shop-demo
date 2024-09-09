import { variationsItems } from '@/components/data';

import CarouselItem from './CarouselItem';
import NavigationButton from './NavigationButton';

const VariationsCarousel: React.FC = () => {
  return (
    <nav className="flex w-full px-10">
      <div className="flex w-full items-center justify-center gap-1 self-stretch">
        {variationsItems?.map((item, idx) => (
          <CarouselItem key={idx} title={item.title} imageSrc={item.imageSrc} />
        ))}
      </div>
      <div className="absolute left-0 top-[calc(_50%_-_20px)] w-full">
        <div className="absolute left-0">
          <NavigationButton direction="left" />
        </div>
        <div className="absolute right-0">
          <NavigationButton direction="right" />
        </div>
      </div>
    </nav>
  );
};

export default VariationsCarousel;
