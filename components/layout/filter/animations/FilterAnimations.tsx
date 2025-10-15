'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import type { JSX, ReactNode } from 'react';
import { useContext, useRef } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

/**
 * Filter wrapper animations component
 * Uses GSAP library to animate filter elements with staggered entrance and exit animations
 * @param   {object}      props           - Filter wrapper props
 * @param   {ReactNode}   props.children  - children ReactNode elements to be animated
 * @param   {string}      props.className - CSS class names for styling the wrapper
 * @param   {number}      props.index     - index of element in array for staggered animation timing
 * @returns {JSX.Element}                 filter wrapper with entrance/exit animations
 * @see {@link https://gsap.com/cheatsheet/ gsap cheatsheet}
 */
const FilterAnimations = ({
  children,
  className,
  index,
}: {
  children: ReactNode;
  className: string;
  index: number;
}): JSX.Element => {
  /** Get transition state from context to handle closing animation */
  const { transition } = useContext(OpenDrawerContext);

  /** Reference to the wrapper element for GSAP animations */
  const ref = useRef(null);

  /**
   * GSAP animation effect for element entrance animation
   * Creates staggered entrance effect based on element index
   */
  useGSAP(() => {
    /** Create GSAP timeline for entrance animation */
    const tl = gsap.timeline({
      paused: true,
    });

    /** Set initial state before animation */
    tl.set(ref.current, {
      autoAlpha: 0,
      yPercent: 100,
      height: 0,
      /** Animate to final state with staggered delay based on index */
    }).to(ref.current, {
      autoAlpha: 1,
      yPercent: 0,
      height: 'auto',
      delay: index / 10,
    });

    /** Play the entrance animation */
    tl.play();

    /** Cleanup function to kill timeline on unmount */
    return () => {
      tl.kill();
    };
  }, []);

  /**
   * GSAP animation effect for element exit animation
   * Handles closing animation when modal is being dismissed
   */
  useGSAP(() => {
    /** Create GSAP timeline for exit animation */
    const tl = gsap.timeline();

    /** Execute exit animation when transition state is 'close' */
    if (transition === 'close') {
      tl.to(ref.current, {
        autoAlpha: 0,
        yPercent: 100,
        height: 0,
        duration: 0.5,
        /** Negative delay creates staggered exit effect in reverse order */
        delay: -index / 20,
      });
    }

    /** Cleanup function to kill timeline on unmount */
    return () => {
      tl.kill();
    };
  }, [transition]);

  return (
    <div className={className} ref={ref}>
      {children}
    </div>
  );
};

export default FilterAnimations;
