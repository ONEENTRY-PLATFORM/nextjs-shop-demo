/* eslint-disable @typescript-eslint/no-explicit-any */
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
 * @see {@link https://gsap.com/cheatsheet/ gsap cheatsheet}
 * @returns card with animations
 */
const BlockCardAnimations: FC<BlockCardAnimationsProps> = ({
  children,
  className,
  index,
}) => {
  const { stage } = useTransitionState();
  const [prevStage, setPrevStage] = useState('');
  const ref = useRef<any>(null);

  // intro animations
  useGSAP(() => {
    const tl = gsap.timeline({
      paused: true,
    });
    // img
    // tl.set((ref.current as any)?.getElementsByTagName('img'), {
    //   scale: 0,
    //   autoAlpha: 0,
    // }).to((ref.current as any)?.getElementsByTagName('img'), {
    //   scale: 1,
    //   autoAlpha: 1,
    //   delay: index / 10,
    // });

    if (stage === 'none' && prevStage === '') {
      tl.set(ref.current, {
        scale: 0,
        autoAlpha: 0,
      }).to(ref.current, {
        scale: 1,
        autoAlpha: 1,
        duration: 0.5,
        delay: index / 10,
      });
    }

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
        autoAlpha: 0,
        scale: 0,
        duration: 0.35,
        delay: index / 20,
      });
    }

    if (stage === 'none' && prevStage === 'entering') {
      tl.set(ref.current?.querySelectorAll('img'), {
        // scale: 0,
        autoAlpha: 0,
      }).to(ref.current?.querySelectorAll('img'), {
        // scale: 1,
        autoAlpha: 1,
        duration: 0.35,
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

export default BlockCardAnimations;
