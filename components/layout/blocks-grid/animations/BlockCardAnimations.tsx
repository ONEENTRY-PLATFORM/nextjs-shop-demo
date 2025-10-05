/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTransitionState } from 'next-transition-router';
import type { JSX, ReactNode } from 'react';
import { useRef, useState } from 'react';

/**
 * Blocks card animations.
 * @param   {object}      props           - props.
 * @param   {ReactNode}   props.children  - children ReactNode.
 * @param   {string}      props.className - card wrapper className.
 * @param   {number}      props.index     - index of element in array for stagger.
 * @returns {JSX.Element}                 card with animations.
 * @see {@link https://gsap.com/cheatsheet/ gsap cheatsheet}
 */
const BlockCardAnimations = ({
  children,
  className,
  index,
}: {
  children: ReactNode;
  className: string;
  index: number;
}): JSX.Element => {
  const { stage } = useTransitionState();
  const [prevStage, setPrevStage] = useState('');
  const ref = useRef<any>(null);

  // intro animations
  useGSAP(() => {
    const tl = gsap.timeline({
      paused: true,
    });

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
        autoAlpha: 0,
      }).to(ref.current?.querySelectorAll('img'), {
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
