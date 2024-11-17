'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTransitionState } from 'next-transition-router';
import type { FC, ReactNode } from 'react';
import { useRef, useState } from 'react';

/**
 * Product animations
 * @param children children ReactNode
 * @param className CSS className of ref element
 * @param index Index of element for animations stagger
 *
 * @returns data
 */
const ProductAnimations: FC<{
  children: ReactNode;
  className: string;
  index: number;
}> = ({ children, className, index }) => {
  const { stage } = useTransitionState();
  const [prevStage, setPrevStage] = useState('');
  const ref = useRef(null);

  // enter animations
  useGSAP(() => {
    const tl = gsap.timeline({
      paused: true,
    });

    tl.set(ref.current, {
      autoAlpha: 0,
    }).to(ref.current, {
      autoAlpha: 1,
      delay: index / 10,
    });
    tl.play();

    return () => {
      tl.kill();
    };
  }, []);

  // leaving animations
  useGSAP(() => {
    const tl = gsap.timeline();

    if (stage === 'leaving' && prevStage === 'none') {
      tl.to(ref.current, {
        autoAlpha: 0,
        duration: 0.5,
        delay: index / 10,
      });
    }

    setPrevStage(stage);

    return () => {
      tl.kill();
    };
  }, [stage]);

  return (
    <div className={className} ref={ref}>
      {children}
    </div>
  );
};

export default ProductAnimations;
