import type { FC } from 'react';

import CatalogCard from './CatalogCard';

interface CatalogGridProps {
  blocks: Array<string>;
}

const CatalogGrid: FC<CatalogGridProps> = async ({ blocks }) => {
  if (blocks?.length < 1) {
    return;
  }

  return (
    <div className="flex w-full flex-wrap justify-between gap-5 max-md:flex-col">
      {blocks.map((block, index) => (
        <CatalogCard key={index} cardData={block} index={index} />
      ))}
    </div>
  );
};

export default CatalogGrid;
