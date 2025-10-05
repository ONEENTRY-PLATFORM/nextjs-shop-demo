'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTransitionState } from 'next-transition-router';
import type { JSX, ReactNode } from 'react';
import { useRef } from 'react';

/**
 * Category card stage entering/leaving animations.
 * @param   {object}      props           - CategoryAnimations props.
 * @param   {ReactNode}   props.children  - children ReactNode.
 * @param   {string}      props.className - category card wrapper className.
 * @param   {number}      props.index     - index of element in array for stagger.
 * @returns {JSX.Element}                 category card wrapper with animations.
 * @see {@link https://gsap.com/cheatsheet/ gsap cheatsheet}
 */
const CategoryAnimations = ({
  children,
  className,
  index,
}: {
  children: ReactNode;
  className: string;
  index: number;
}): JSX.Element => {
  const { stage } = useTransitionState();
  const ref = useRef(null);

  // stage entering/leaving animations
  useGSAP(() => {
    const tl = gsap.timeline({
      paused: true,
    });

    if (stage === 'leaving') {
      tl.to(ref.current, {
        autoAlpha: 0,
        scale: 0,
        delay: index / 10,
      });
      tl.play();
    }
    if (stage === 'entering') {
      tl.set(ref.current, {
        autoAlpha: 0,
        scale: 0,
      }).to(ref.current, {
        autoAlpha: 1,
        scale: 1,
        delay: index / 10,
      });
      tl.play();
    }

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

export default CategoryAnimations;
