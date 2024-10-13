'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { TransitionRouter } from 'next-transition-router';
import type { FC, ReactNode } from 'react';

gsap.registerPlugin(useGSAP);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TransitionProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <TransitionRouter
      auto={true}
      leave={(next, from, to) => {
        const tl = gsap.timeline({
          paused: true,
        });
        if (from?.indexOf('shop') !== -1) {
          tl.fromTo(
            '.product-card',
            {
              autoAlpha: 1,
            },
            {
              autoAlpha: 0,
              stagger: 0.1,
            },
          );
        }
        tl.fromTo(
          'main',
          {
            autoAlpha: 1,
          },
          {
            autoAlpha: 0,
            stagger: 0.3,
          },
        );
        tl.call(next, undefined, '<50%');
        tl.play();

        return () => {
          tl.kill();
        };
      }}
      enter={(next, from, to) => {
        console.log({ from, to });
        const tl = gsap.timeline({
          paused: true,
        });
        tl.fromTo(
          'main',
          {
            autoAlpha: 0,
          },
          {
            autoAlpha: 1,
          },
        );
        if (from?.indexOf('shop') !== -1) {
          tl.fromTo(
            '.product-card',
            {
              autoAlpha: 0,
            },
            {
              autoAlpha: 1,
              stagger: 0.1,
            },
          );
        }
        tl.call(next, undefined, '<50%');
        tl.play();
        return () => {
          tl.kill();
        };
      }}
    >
      {children}
    </TransitionRouter>
  );
};

export default TransitionProvider;
