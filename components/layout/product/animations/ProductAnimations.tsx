'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTransitionState } from 'next-transition-router';
import type { JSX, ReactNode } from 'react';
import { useRef, useState } from 'react';

/**
 * Product animations component.
 * Handles staggered fade-in and fade-out animations for product elements using GSAP.
 * Manages both entrance animations on component mount and leaving animations during page transitions.
 * @param   {object}      props           - Component properties.
 * @param   {ReactNode}   props.children  - Child components to be animated.
 * @param   {string}      props.className - CSS className for the wrapper element.
 * @param   {number}      props.index     - Index of element for animations stagger effect.
 * @returns {JSX.Element}                 Animated wrapper element.
 * @see {@link https://gsap.com/cheatsheet/ gsap cheatsheet}
 */
const ProductAnimations = ({
  children,
  className,
  index,
}: {
  children: ReactNode;
  className: string;
  index: number;
}): JSX.Element => {
  /** Get the current transition stage from next-transition-router */
  const { stage } = useTransitionState();

  /** Track the previous stage to detect stage changes */
  const [prevStage, setPrevStage] = useState('');

  /** Reference to the DOM element for GSAP animations */
  const ref = useRef(null);

  /**
   * Entrance animations - fade in elements with staggered delays.
   * Runs once when the component is mounted.
   */
  useGSAP(() => {
    /** Create a GSAP timeline for coordinated animations */
    const tl = gsap.timeline({
      paused: true,
    });

    /** Set initial state to hidden and animate to visible with staggered delay */
    tl.set(ref.current, {
      autoAlpha: 0,
    }).to(ref.current, {
      autoAlpha: 1,
      delay: index / 10,
    });

    /** Play the entrance animation */
    tl.play();

    /** Cleanup function to kill the timeline on unmount */
    return () => {
      tl.kill();
    };
  }, []);

  /**
   * Leaving animations - fade out elements when transitioning away.
   * Runs when the page transition stage changes.
   */
  useGSAP(() => {
    /** Create a GSAP timeline for coordinated animations */
    const tl = gsap.timeline();

    /** Animate to hidden when leaving the page with staggered delay */
    if (stage === 'leaving' && prevStage === 'none') {
      tl.to(ref.current, {
        autoAlpha: 0,
        duration: 0.5,
        delay: index / 10,
      });
    }

    /** Update the previous stage for comparison */
    setPrevStage(stage);

    /** Cleanup function to kill the timeline on unmount */
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
