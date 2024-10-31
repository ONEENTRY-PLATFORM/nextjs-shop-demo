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
    if (!ref.current) {
      return;
    }
    const tl = gsap
      .timeline()
      .set(ref.current, {
        autoAlpha: 0,
      })
      .to(ref.current, {
        autoAlpha: 1,
        duration: 0.5,
        delay: index / 10,
      });

    if (stage === 'leaving' && prevStage === 'none') {
      tl.play();
    }
    if (stage === 'none' && prevStage === 'leaving') {
      tl.reverse(0.5);
    }

    setPrevStage(stage);

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default FadeTransition;
