'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTransitionState } from 'next-transition-router';
import type { FC, ReactNode } from 'react';
import { useRef, useState } from 'react';

/**
 * Order row animations
 * @param children children ReactNode
 * @param className CSS className of ref element
 * @param index Index of element for animations stagger
 *
 * @returns JSX.Element
 */
const OrderRowAnimations: FC<{
  children: ReactNode;
  className: string;
  index: number;
}> = ({ children, className, index }) => {
  const { stage } = useTransitionState();
  const [prevStage, setPrevStage] = useState('');
  const ref = useRef(null);

  // intro animations
  useGSAP(() => {
    if (!ref.current) {
      return;
    }
    const tl = gsap.timeline({
      paused: true,
    });

    tl.set(ref.current, {
      autoAlpha: 0,
    })
      .to(ref.current, {
        autoAlpha: 1,
        delay: index / 10,
      })
      .play();

    return () => {
      tl.kill();
    };
  }, []);

  // leaving stage animations
  useGSAP(() => {
    if (!ref.current) {
      return;
    }
    const tl = gsap.timeline({
      paused: true,
    });

    if (stage === 'leaving' && prevStage === 'none') {
      tl.to(ref.current, {
        autoAlpha: 0,
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

export default OrderRowAnimations;
