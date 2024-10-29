'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTransitionState } from 'next-transition-router';
import type { FC, ReactNode } from 'react';
import { useRef, useState } from 'react';

const OrderRowAnimations: FC<{
  children: ReactNode;
  className: string;
  index: number;
}> = ({ children, className, index }) => {
  const { stage } = useTransitionState();
  const [prevStage, setPrevStage] = useState('');
  const ref = useRef(null);

  useGSAP(() => {
    if (!ref.current) {
      return;
    }
    const elements = (ref.current as HTMLDivElement).querySelectorAll(
      'button>div',
    );
    const tl = gsap.timeline({
      paused: true,
    });
    tl.set(elements, {
      transformOrigin: '0 center',
    });

    if (stage === 'none' && prevStage === 'entering') {
      tl.set([elements, ref.current], {
        autoAlpha: 0,
      })
        .to(ref.current, {
          autoAlpha: 1,
          delay: index / 10,
        })
        .to(elements, {
          autoAlpha: 1,
          delay: index / 10,
        })
        .play();
    }

    if (stage === 'leaving' && prevStage === 'none') {
      tl.to(elements, {
        autoAlpha: 0,
        delay: index / 10,
      })
        .to(ref.current, {
          autoAlpha: 0,
          delay: index / 10,
        })
        .play();
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

export default OrderRowAnimations;
