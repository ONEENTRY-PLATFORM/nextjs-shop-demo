import { type FC } from 'react';

import { blocksColors, blocksData } from '@/components/data';

import BlocksGridAnimations from './animations/BlocksGridAnimations';
import BlocksGridCard from './components/BlocksGridCard';

interface BlocksGridProps {
  blocks: Array<string>;
  lang: string;
}

/**
 * Blocks grid
 * @param blocks array of blocks names
 * @param lang current language shortcode
 *
 * @returns blocks grid with animations
 */
const BlocksGrid: FC<BlocksGridProps> = async ({ blocks, lang }) => {
  if (blocks?.length < 1) {
    return 'Blocks not found';
  }

  return (
    <BlocksGridAnimations
      className={'block-card relative box-border w-full shrink-0'}
    >
      <div className="flex w-full flex-wrap justify-between gap-5 max-md:flex-col">
        {blocks.map((block, index) => {
          const className = blocksData[index as keyof typeof blocksData];

          return (
            <BlocksGridCard
              key={index}
              index={index}
              marker={block}
              className={
                className as {
                  width: string;
                  height: string;
                }
              }
              bgColor={blocksColors[block as keyof typeof blocksColors]}
              lang={lang}
            />
          );
        })}
      </div>
    </BlocksGridAnimations>
  );
};

export default BlocksGrid;
