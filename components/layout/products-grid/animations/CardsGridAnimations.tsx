/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTransitionState } from 'next-transition-router';
import type { FC, ReactNode } from 'react';
import { useRef, useState } from 'react';

const CardsGridAnimations: FC<{
  children: ReactNode;
  className: string;
}> = ({ children, className }) => {
  const { stage } = useTransitionState();
  const [prevStage, setPrevStage] = useState('');
  const ref = useRef(null);

  useGSAP(() => {
    // const tl = gsap.timeline({
    //   paused: true,
    // });
    // tl.to(ref.current, {
    //   autoAlpha: 0,
    //   duration: 0.35,
    // });
    // if (stage === 'leaving' && prevStage === 'none') {
    //   tl.play();
    // }
    // setPrevStage(stage);
    // return () => {
    //   tl.kill();
    // };
  }, [stage]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default CardsGridAnimations;
