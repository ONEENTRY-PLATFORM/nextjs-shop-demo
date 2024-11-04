/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTransitionState } from 'next-transition-router';
import type { FC } from 'react';
import { useRef, useState } from 'react';

import type { AnimationsProps } from '../types/global';

const FadeTransition: FC<AnimationsProps> = ({
  children,
  className,
  index,
}) => {
  const { stage } = useTransitionState();
  const [prevStage, setPrevStage] = useState('');
  const ref = useRef(null);

  useGSAP(() => {
    // if (!ref.current) {
    //   return;
    // }
    const tl = gsap
      .timeline()
      .set(ref.current, {
        autoAlpha: 0,
      })
      .to(ref.current, {
        autoAlpha: 1,
        duration: 0.8,
        delay: index / 10,
      });
    // if (stage === 'leaving' && prevStage === 'none') {
    //   tl.reverse(1);
    // }
    // setPrevStage(stage);
    return () => {
      tl.kill();
    };
  }, []);

  // useGSAP(() => {
  //   if (!ref.current) {
  //     return;
  //   }
  //   const tl = gsap
  //     .timeline({ paused: true })
  //     .set(ref.current, {
  //       autoAlpha: 0,
  //     })
  //     .to(ref.current, {
  //       autoAlpha: 1,
  //       duration: 0.5,
  //       delay: index / 10,
  //     });

  //   tl.play();

  //   return () => {
  //     tl.kill();
  //   };
  // }, []);

  return (
    <div ref={ref} className={className + ' opacity-0'}>
      {children}
    </div>
  );
};

export default FadeTransition;
