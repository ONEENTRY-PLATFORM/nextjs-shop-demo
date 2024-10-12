import { type FC } from 'react';

import BlocksGridCard from './BlocksGridCard';

interface BlocksGridProps {
  blocks: Array<string>;
  blocksData: object;
  blocksColors: object;
  lang: string;
}

const BlocksGrid: FC<BlocksGridProps> = async ({
  blocks,
  blocksData,
  blocksColors,
  lang,
}) => {
  return (
    <div className="flex w-full flex-wrap justify-between gap-5 max-md:flex-col">
      {blocks?.length > 1 &&
        blocks.map((block, index) => {
          const className = blocksData[index as keyof typeof blocksData];
          const bgColor = blocksColors[block as keyof typeof blocksColors];

          return (
            <BlocksGridCard
              key={index}
              marker={block}
              className={className}
              bgColor={bgColor}
              lang={lang}
            />
          );
        })}
    </div>
  );
};

export default BlocksGrid;
