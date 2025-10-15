'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTransitionState } from 'next-transition-router';
import type { JSX, ReactNode } from 'react';
import { useRef } from 'react';

/**
 * Category card stage entering/leaving animations.
 * Uses GSAP library to animate category cards during page transitions
 * @param   {object}      props           - CategoryAnimations props
 * @param   {ReactNode}   props.children  - children ReactNode elements to be animated
 * @param   {string}      props.className - CSS class names for styling the category card wrapper
 * @param   {number}      props.index     - index of element in array for staggered animation timing
 * @returns {JSX.Element}                 category card wrapper with entrance/exit animations
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
  /** Get current transition stage (entering or leaving) from next-transition-router */
  const { stage } = useTransitionState();

  /** Reference to the category card element for GSAP animations */
  const ref = useRef(null);

  /**
   * GSAP animation effect for category card entrance and exit animations
   * Handles both entering and leaving stage animations with staggered timing
   */
  useGSAP(() => {
    /** Create GSAP timeline for animations */
    const tl = gsap.timeline({
      paused: true,
    });

    /** Handle leaving stage animation - scale down and fade out */
    if (stage === 'leaving') {
      tl.to(ref.current, {
        autoAlpha: 0,
        scale: 0,
        delay: index / 10,
      });
      tl.play();
    }

    /** Handle entering stage animation - scale up and fade in */
    if (stage === 'entering') {
      /** Set initial state before animation */
      tl.set(ref.current, {
        autoAlpha: 0,
        scale: 0,
        /** Animate to final state with staggered delay based on index */
      }).to(ref.current, {
        autoAlpha: 1,
        scale: 1,
        delay: index / 10,
      });
      tl.play();
    }

    /** Cleanup function to kill timeline on unmount */
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
