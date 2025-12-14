'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import type { JSX } from 'react';

/**
 * Blocks grid loader component for displaying skeleton loaders for content blocks.
 * Renders a grid of placeholder blocks with animations while content is loading.
 * @param   {object}      props              - Props for the component
 * @param   {object}      props.blocksData   - Data for the blocks
 * @param   {object}      props.blocksColors - Colors for the blocks
 * @returns {JSX.Element}                    Loader component
 */
const BlocksGridLoader = ({
  blocksData,
  blocksColors,
}: {
  blocksData: object;
  blocksColors: object;
}): JSX.Element => {
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
   */
  useGSAP(() => {
    /** Create a GSAP timeline for the block loader animations */
    const tl = gsap.timeline({
      paused: true,
      id: 'BlocksGridTL',
    });

    /**
     * Set initial state and animate block cards into view
     * Uses autoAlpha for combined opacity and visibility control
     */
    tl.set('.block-card', {
      autoAlpha: 0,
    }).to('.block-card', {
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
  }, []);

  return (
    /**
     * Container for the grid of block loaders
     * Uses flexbox for responsive layout with wrapping behavior
     */
    <div className="flex w-full flex-wrap justify-between gap-5 max-md:flex-col">
      {
        /**
         * Map through block names and render a loader for each
         * Each loader has specific dimensions and colors based on block type
         */
        blocks.map((block, index) => {
          /** Get CSS classes for block by index */
          const className = blocksData[index as keyof typeof blocksData] as {
            width: string;
            height: string;
          };

          /** Get background color class based on block name */
          const bgColor = blocksColors[block as keyof typeof blocksColors];

          return (
            <div
              key={index}
              className={`block-card ${className.width} ${className.height}`}
            >
              <div
                className={`relative flex size-full p-6 ${bgColor} overflow-hidden rounded-3xl`}
              >
                {/** Placeholder for block icon or logo */}
                <div className="absolute left-3 top-3 z-10">
                  <div className="size-7.5" />
                </div>

                {/** Placeholder for block title or heading */}
                <div className="z-10 mt-auto bg-slate-50"></div>

                {/** Placeholder for block content or description */}
                <div className="z-10 ml-auto mt-auto w-60 bg-slate-50 max-sm:ml-0"></div>

                {/** Placeholder for block background image or pattern */}
                <div className="absolute left-0 top-0 z-0 size-full rounded-3xl object-cover opacity-15 invert">
                  <div
                    className={
                      'relative flex size-full flex-col items-center justify-center overflow-hidden rounded-xl bg-slate-50 '
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
