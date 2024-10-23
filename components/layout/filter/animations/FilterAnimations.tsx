'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTransitionState } from 'next-transition-router';
import type { FC, ReactNode } from 'react';
import { useContext, useRef, useState } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

const FilterAnimations: FC<{
  children: ReactNode;
  className: string;
  index: number;
}> = ({ children, className, index }) => {
  const { stage } = useTransitionState();
  const { transition } = useContext(OpenDrawerContext);
  const ref = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      paused: true,
    });

    tl.set(ref.current, {
      autoAlpha: 0,
      yPercent: 100,
      height: 0,
    }).to(ref.current, {
      autoAlpha: 1,
      yPercent: 0,
      height: 'auto',
      delay: index / 10,
    });
    tl.play();

    return () => {
      tl.kill();
    };
  }, []);

  useGSAP(() => {
    const tl = gsap.timeline();

    if (transition === 'close') {
      tl.to(ref.current, {
        autoAlpha: 0,
        yPercent: 100,
        height: 0,
        duration: 0.5,
        delay: -index / 20,
      });
    }

    return () => {
      tl.kill();
    };
  }, [transition]);

  return (
    <div className={className} ref={ref}>
      {children}
    </div>
  );
};

export default FilterAnimations;
