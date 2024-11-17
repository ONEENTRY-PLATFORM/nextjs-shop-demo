'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import type { FC } from 'react';

import type { LoaderProps } from '@/app/types/global';
import { blocksColors, blocksData } from '@/components/data';

/**
 * Blocks grid loader
 *
 * @returns Loader
 */
const BlocksGridLoader: FC<LoaderProps> = () => {
  // array of blocks names
  const blocks = [
    'home_banner',
    'offer_best_seller',
    'offer_promotion',
    'offer_offer_day',
    'offer_new_arrivals',
    'offer_youtube',
  ];

  // intro animations
  useGSAP(() => {
    const tl = gsap.timeline({
      paused: true,
      id: 'BlocksGridTL',
    });

    tl.set('.block-card', {
      autoAlpha: 0,
    }).to('.block-card', {
      autoAlpha: 1,
      stagger: 0.1,
    });

    tl.play();

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="flex w-full flex-wrap justify-between gap-5 max-md:flex-col">
      {blocks.map((block, index) => {
        const className = blocksData[index as keyof typeof blocksData] as {
          width: string;
          height: string;
        };
        const bgColor = blocksColors[block as keyof typeof blocksColors];
        return (
          <div
            key={index}
            className={`block-card ${className.width} ${className.height}`}
          >
            <div
              className={`relative flex size-full p-6 ${bgColor} overflow-hidden rounded-3xl`}
            >
              <div className="absolute left-3 top-3 z-10">
                <div className="size-[30px]" />
              </div>

              <div className="z-10 mt-auto bg-slate-50"></div>
              <div className="z-10 ml-auto mt-auto w-60 bg-slate-50 max-sm:ml-0"></div>

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
      })}
    </div>
  );
};

export default BlocksGridLoader;
