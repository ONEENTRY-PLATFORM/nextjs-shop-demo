/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import '@egjs/react-flicking/dist/flicking.css';

import { Arrow } from '@egjs/flicking-plugins';
import Flicking, { ViewportSlot } from '@egjs/react-flicking';

import { variationsItems } from '@/components/data';

import CarouselItem from './CarouselItem';
import NavigationButton from './NavigationButton';

const VariationsCarousel: React.FC = () => {
  const plugins = [new Arrow()];

  return (
    <nav className="flex w-full items-center justify-center gap-3 self-stretch">
      <div className="flex gap-1.5 self-stretch">
        <Flicking
          plugins={plugins}
          // hideBeforeInit={true}
          // firstPanelSize="200px"
          align="prev"
          circular={true}
          onMoveEnd={(e) => {
            // console.log(e);
          }}
        >
          {variationsItems.map((item, idx) => (
            <div key={idx}>
              <CarouselItem title={item.title} imageSrc={item.imageSrc} />
            </div>
          ))}
          <ViewportSlot>
            <div className="flicking-arrow-prev is-outside">
              <NavigationButton direction="left" />
            </div>
            <div className="flicking-arrow-next is-outside">
              <NavigationButton direction="right" />
            </div>
          </ViewportSlot>
        </Flicking>
      </div>
    </nav>
  );
};

export default VariationsCarousel;
