import React from 'react';

import CatalogCard from './CatalogCard';

const CatalogGrid: React.FC<{
  blocks: Array<string>;
}> = async ({ blocks }) => {
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
