'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import type { JSX } from 'react';
import { useRef } from 'react';

import type { BlockData } from '@/components/data';

/**
 * Blocks grid loader component for displaying skeleton loaders for content blocks.
 * Renders a grid of placeholder blocks with animations while content is loading.
 * @param   {object}                 props              - Props for the component
 * @param   {BlockData[]}            props.blocksData   - Layout data for the blocks
 * @param   {Record<string, string>} props.blocksColors - Background color classes per block marker
 * @returns {JSX.Element}                               Loader component
 */
const BlocksGridLoader = ({
  blocksData,
  blocksColors,
}: {
  blocksData: BlockData[];
  blocksColors: Record<string, string>;
}): JSX.Element => {
  /** Container reference — scopes the GSAP selectors to this loader's own cards */
  const ref = useRef<HTMLDivElement>(null);

  /**
   * Array of block names representing different content sections
   * Each name corresponds to a specific type of content block in the grid
   */
  const blocks = [
    'home_banner',
    'offer_best_seller',
    'offer_promotion',
    'offer_offer_day',
    'offer_new_arrivals',
    'offer_youtube',
  ];

  /**
   * Intro animations for the block loaders using GSAP
   * Applies a staggered fade-in effect to all block cards
   *
   * `scope` is load-bearing here, not hygiene: `.block-card` is also the class
   * of the real content cards (`BlocksGridCard`, `BlocksGrid`) and of
   * `CategoryCard`. Unscoped, this loader set `autoAlpha: 0` on every one of
   * them anywhere on the page and then faded them all back in with its own
   * stagger — hiding already-loaded content while a sibling block was still
   * loading. Scoped, it only touches its own skeleton cards.
   */
  useGSAP(
    () => {
      /**
       * Hide synchronously, before first paint: a timeline's set() only
       * applies on the next GSAP tick, which can land after paint under
       * main-thread jank — the visible skeleton would flash before being
       * hidden. Uses autoAlpha for combined opacity and visibility control.
       */
      gsap.set('.block-card', {
        autoAlpha: 0,
      });

      /** Create a GSAP timeline for the block loader animations */
      const tl = gsap.timeline({
        paused: true,
        id: 'BlocksGridTL',
      });

      /** Animate block cards into view */
      tl.to('.block-card', {
        autoAlpha: 1,
        stagger: 0.1,
      });

      tl.play();

      /**
       * Cleanup function to kill the timeline
       * Ensures proper disposal of animations to prevent memory leaks
       */
      return () => {
        tl.kill();
      };
    },
    { dependencies: [], scope: ref },
  );

  return (
    /**
     * Container for the grid of block loaders
     * Uses flexbox for responsive layout with wrapping behavior
     */
    <div
      ref={ref}
      className="flex w-full flex-wrap justify-between gap-5 max-md:flex-col"
    >
      {
        /**
         * Map through block names and render a loader for each
         * Each loader has specific dimensions and colors based on block type
         */
        blocks.map((block, index) => {
          /** Get CSS classes for block by index */
          const className = blocksData[index]?.className ?? '';

          /** Get background color class based on block name */
          const bgColor = blocksColors[block] ?? '';

          return (
            <div key={block} className={`block-card ${className}`}>
              <div
                className={`relative flex size-full p-6 ${bgColor} overflow-hidden rounded-3xl`}
              >
                {/** Placeholder for block icon or logo */}
                <div className="absolute top-3 left-3 z-10">
                  <div className="size-7.5" />
                </div>

                {/** Placeholder for block title or heading */}
                <div className="z-10 mt-auto bg-slate-50"></div>

                {/** Placeholder for block content or description */}
                <div className="z-10 mt-auto ml-auto w-60 bg-slate-50 max-sm:ml-0"></div>

                {/** Placeholder for block background image or pattern */}
                <div className="absolute top-0 left-0 z-0 size-full rounded-3xl object-cover opacity-15 invert">
                  <div
                    className={
                      'relative flex size-full flex-col items-center justify-center overflow-hidden rounded-xl bg-slate-50'
                    }
                  />
                </div>
              </div>
            </div>
          );
        })
      }
    </div>
  );
};

export default BlocksGridLoader;
