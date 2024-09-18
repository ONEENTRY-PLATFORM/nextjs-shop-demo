import type { FC } from 'react';

import CatalogCard from './CatalogCard';

interface CatalogGridProps {
  blocks: Array<string>;
}

const CatalogGrid: FC<CatalogGridProps> = async ({ blocks }) => {
  if (blocks?.length < 1) {
    return;
  }

  const classNames = {
    home_banner: {
      class_name: 'bg-amber-600 max-sm:flex-col',
      width: 'w-full',
      height: 'h-[175px]',
    },
    offer_best_seller: {
      class_name: 'bg-purple-600',
      width: 'w-full lg:w-[calc(_33%_-_0.65rem)] md:w-[calc(_50%_-_0.65rem)]',
      height: 'h-[260px]',
    },
    offer_promotion: {
      class_name: 'bg-blue-500',
      width: 'w-full lg:w-[calc(_33%_-_0.65rem)] md:w-[calc(_50%_-_0.65rem)]',
      height: 'h-[260px]',
    },
    offer_offer_day: {
      class_name: 'bg-lime-700',
      width: 'w-full lg:w-[calc(_33%_-_0.65rem)] md:w-[calc(_50%_-_0.65rem)]',
      height: 'h-[260px]',
    },
    offer_new_arrivals: {
      class_name: 'bg-teal-300',
      width: 'w-full md:w-[calc(_50%_-_0.65rem)]',
      height: 'h-[260px]',
    },
    offer_youtube: {
      class_name: 'bg-amber-300',
      width: 'w-full lg:w-[calc(_50%_-_0.65rem)]',
      height: 'h-[260px]',
    },
  };

  return (
    <div className="flex w-full flex-wrap justify-between gap-5 max-md:flex-col">
      {blocks.map((block, index) => {
        const className = classNames[block as keyof typeof classNames];
        return <CatalogCard key={index} marker={block} className={className} />;
      })}
    </div>
  );
};

export default CatalogGrid;
