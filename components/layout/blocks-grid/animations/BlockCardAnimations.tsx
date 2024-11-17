'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTransitionState } from 'next-transition-router';
import type { FC, ReactNode } from 'react';
import { useRef, useState } from 'react';

interface BlockCardAnimationsProps {
  children: ReactNode;
  className: string;
  index: number;
}

/**
 * Blocks card animations
 * @param children children ReactNode
 * @param className card wrapper className
 * @param index index of element in array for stagger
 *
 * @returns card with animations
 */
const BlockCardAnimations: FC<BlockCardAnimationsProps> = ({
  children,
  className,
  index,
}) => {
  const { stage } = useTransitionState();
  const [prevStage, setPrevStage] = useState('');
  const ref = useRef(null);

  // intro animations
  useGSAP(() => {
    const tl = gsap.timeline({
      paused: true,
    });

    tl.set(ref.current, {
      scale: 0,
      autoAlpha: 0,
    }).to(ref.current, {
      scale: 1,
      autoAlpha: 1,
      delay: index / 10,
    });

    tl.play();

    return () => {
      tl.kill();
    };
  }, []);

  // stage leaving animations
  useGSAP(() => {
    const tl = gsap.timeline();

    if (stage === 'leaving' && prevStage === 'none') {
      tl.to(ref.current, {
        scale: 0,
        duration: 0.5,
        delay: index / 20,
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

export default BlockCardAnimations;
