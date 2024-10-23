'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTransitionState } from 'next-transition-router';
import type { FC, ReactNode } from 'react';
import { useRef, useState } from 'react';

const OrderAnimations: FC<{
  children: ReactNode;
  className: string;
  index: number;
}> = ({
  children,
  className,
  index,
}) => {  
  const { stage } = useTransitionState();
  const [prevStage, setPrevStage] = useState('');
  const ref = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      paused: true,
    });

    if (stage === 'leaving' && prevStage === 'none') {
      tl.to(ref.current, {
        autoAlpha: 0,
        scaleY: 0,
        width: 0,
        delay: index / 10,
      }).play();
    }

    if (stage === 'none' && prevStage === 'entering') {
      tl.set(ref.current, {
        autoAlpha: 0,
        scaleY: 0,
        width: 0,
      }).to(ref.current, {
        autoAlpha: 1,
        scaleY: 1,
        width: "100%",
        delay: index / 10,
      }).play();
    }
    setPrevStage(stage);

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

export default OrderAnimations;
