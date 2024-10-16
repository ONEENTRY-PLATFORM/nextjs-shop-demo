import { type FC } from 'react';

import BlocksGridAnimations from '@/app/animations/BlocksGridAnimations';
import { blocksColors, blocksData } from '@/components/data';

import BlocksGridCard from './BlocksGridCard';

interface BlocksGridProps {
  blocks: Array<string>;
  lang: string;
}

const BlocksGrid: FC<BlocksGridProps> = async ({ blocks, lang }) => {
  if (blocks?.length < 1) {
    return;
  }

  return (
    <BlocksGridAnimations
      className={'block-card relative box-border w-full shrink-0'}
    >
      <div className="flex w-full flex-wrap justify-between gap-5 max-md:flex-col">
        {blocks.map((block, index) => {
          const className = blocksData[index as keyof typeof blocksData];
          const bgColor = blocksColors[block as keyof typeof blocksColors];

          return (
            <BlocksGridCard
              key={index}
              marker={block}
              className={
                className as {
                  width: string;
                  height: string;
                }
              }
              bgColor={bgColor}
              lang={lang}
            />
          );
        })}
      </div>
    </BlocksGridAnimations>
  );
};

export default BlocksGrid;
