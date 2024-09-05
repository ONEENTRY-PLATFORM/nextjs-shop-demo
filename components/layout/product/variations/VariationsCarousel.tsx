/* eslint-disable tailwindcss/no-custom-classname */
import { variationsItems } from '@/components/data';

import CarouselItem from './CarouselItem';
import NavigationButton from './NavigationButton';

const VariationsCarousel: React.FC = () => {
  return (
    <nav className="flex w-full items-center justify-center self-stretch">
      <div className="flex gap-1.5 self-stretch">
        {variationsItems.map((item, idx) => (
          <CarouselItem key={idx} title={item.title} imageSrc={item.imageSrc} />
        ))}
        <div>
          <div className="flicking-arrow-prev is-outside">
            <NavigationButton direction="left" />
          </div>
          <div className="flicking-arrow-next is-outside">
            <NavigationButton direction="right" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default VariationsCarousel;
