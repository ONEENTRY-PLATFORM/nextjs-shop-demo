'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTransitionState } from 'next-transition-router';
import type { FC } from 'react';
import type { ReactNode } from 'react';
import { useRef } from 'react';

import type { LoaderProps } from '@/app/types/global';
import Placeholder from '@/components/shared/Placeholder';

const CardsGridAnimations = ({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) => {
  const { stage } = useTransitionState();
  const ref = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      paused: true,
    });

    tl.set('.product-card', {
      autoAlpha: 0,
    })
      .set('.opacity-30', {
        width: 0,
        transformOrigin: '100% 100%',
      })
      .to('.product-card', {
        autoAlpha: 1,
        duration: 0.2,
        stagger: 0.05,
      })
      .to('.opacity-30', {
        width: '100%',
        duration: 0.5,
        stagger: 0.05,
        transformOrigin: '100% 100%',
      });
    tl.play();

    return () => {
      tl.kill();
    };
  }, [stage]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

const ProductsGridLoader: FC<LoaderProps> = ({ limit = 10 }) => {
  return (
    <CardsGridAnimations
      className={'relative box-border flex w-full shrink-0 flex-col'}
    >
      <section className="relative mx-auto box-border flex min-h-[100px] w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
        <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 max-md:w-full">
          {Array.from(Array(limit).keys()).map((item) => (
            <div
              key={item}
              className={
                'product-card animate-loader relative flex size-full min-h-[360px] flex-col items-center rounded-3xl p-4 opacity-40'
              }
            >
              <div className="relative mb-3 size-40 w-full opacity-40">
                <Placeholder />
              </div>
              <div className="z-10 mb-4 mt-auto flex h-6 w-full flex-col rounded-full bg-white opacity-30"></div>
              <div className="z-10 mb-2 mt-auto flex h-4 w-full flex-col gap-2.5 rounded-full bg-white opacity-30"></div>
              <div className="z-10 mb-2 mt-auto flex h-4 w-full flex-col gap-2.5 rounded-full bg-white opacity-30"></div>
              <div className="z-10 mb-4 mt-auto flex h-8 w-full flex-col gap-2.5 rounded-full bg-white opacity-30"></div>
            </div>
          ))}
        </div>
        <div className="mt-5 flex h-8 w-full"></div>
      </section>
    </CardsGridAnimations>
  );
};

export default ProductsGridLoader;
