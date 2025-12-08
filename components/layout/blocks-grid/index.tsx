import type { JSX } from 'react';

import BlocksGridAnimations from './animations/BlocksGridAnimations';
import BlocksGridCard from './components/BlocksGridCard';
/**
 * Configuration data for different block types used in the application
 *
 * This array contains width and height configurations for various block types
 * used throughout the application. Each entry corresponds to a specific block
 * identifier and contains CSS classes for styling.
 */
export const blocksData: Array<{ className: string }> = [
  // home_banner:
  {
    className: 'w-full max-sm:flex-col h-[175px]',
  },
  // offer_best_seller:
  {
    className:
      'w-full lg:w-[calc(33%-0.65rem)] md:w-[calc(50%-0.65rem)] h-[260px]',
  },
  // offer_promotion:
  {
    className:
      'w-full lg:w-[calc(33%-0.65rem)] md:w-[calc(50%-0.65rem)] h-[260px]',
  },
  // offer_offer_day:
  {
    className:
      'w-full lg:w-[calc(33%-0.65rem)] md:w-[calc(50%-0.65rem)] h-[260px]',
  },
  // offer_new_arrivals:
  {
    className: 'w-full md:w-[calc(50%-0.65rem)] h-[260px]',
  },
  // offer_youtube:
  {
    className: 'w-full lg:w-[calc(50%-0.65rem)] h-[260px]',
  },
];

/**
 * Color configurations for different block types
 *
 * This object maps block identifiers to their corresponding background color
 * classes and additional styling. Used to apply consistent color schemes
 * across different sections of the application.
 */
export const blocksColors = {
  home_banner: 'bg-purple-200 w-full max-sm:flex-col',
  offer_best_seller: 'bg-purple-600',
  offer_promotion: 'bg-orange-300',
  offer_offer_day: 'bg-purple-300',
  offer_new_arrivals: 'bg-teal-300',
  offer_youtube: 'bg-blue-200',
};

/**
 * Blocks grid component that renders a grid of content blocks with animations
 * Maps through an array of block names and renders corresponding block cards
 * Uses block data and color configurations to style each block appropriately
 * Wrapped with animation component for entrance effects
 * @param   {object}               props        - Component props
 * @param   {Array<string>}        props.blocks - Array of block marker names to render
 * @param   {string}               props.lang   - Current language shortcode for localization
 * @returns {Promise<JSX.Element>}              Blocks grid component with animated block cards
 */
const BlocksGrid = async ({
  blocks,
  lang,
}: {
  blocks: Array<string>;
  lang: string;
}): Promise<JSX.Element> => {
  /** Return early if no blocks are provided or array is empty */
  if (!blocks || blocks?.length < 1) {
    return <>Blocks not found</>;
  }

  return (
    /** Wrap block grid with animation component for entrance effects */
    <BlocksGridAnimations
      className={'block-card relative box-border w-full shrink-0'}
    >
      {/** Container for block cards with responsive flex layout */}
      <div className="flex w-full flex-wrap justify-between gap-5 max-md:flex-col">
        {Array.isArray(blocks) ? (
          blocks.map((block, index) => {
            /** Get styling data for the current block based on its index */
            const blockData = blocksData[index];
            const className = blockData ? blockData.className : '';

            return (
              /** Individual block card component with index, marker, styling and localization */
              <BlocksGridCard
                key={index}
                index={index}
                marker={block}
                className={className}
                lang={lang}
                blocksColors={blocksColors}
              />
            );
          })
        ) : (
          /** Fallback message when blocks data is not an array */
          <div>Blocks not found</div>
        )}
      </div>
    </BlocksGridAnimations>
  );
};

export default BlocksGrid;
