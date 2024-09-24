import type { FC } from 'react';

import CatalogCard from './CatalogCard';

interface CatalogGridProps {
  blocks: Array<string>;
  classNames: object;
}

const CatalogGrid: FC<CatalogGridProps> = async ({ blocks, classNames }) => {
  return (
    <div className="flex w-full flex-wrap justify-between gap-5 max-md:flex-col">
      {blocks?.length > 1 &&
        blocks.map((block, index) => {
          const className = classNames[block as keyof typeof classNames];
          return (
            <CatalogCard key={index} marker={block} className={className} />
          );
        })}
    </div>
  );
};

export default CatalogGrid;
