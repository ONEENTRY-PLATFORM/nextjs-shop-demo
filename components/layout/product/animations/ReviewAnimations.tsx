'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTransitionState } from 'next-transition-router';
import type { JSX, ReactNode } from 'react';
import { useRef, useState } from 'react';

/**
 * Review animations component.
 * Handles staggered animations for review elements using GSAP.
 * Manages both toggle animations based on state changes and leaving animations during page transitions.
 * @param   {object}      props           - Component properties.
 * @param   {ReactNode}   props.children  - Child components to be animated.
 * @param   {string}      props.className - CSS className for the wrapper element.
 * @param   {number}      props.index     - Index of element for animations stagger effect.
 * @param   {boolean}     props.state     - Current state of review (expanded or collapsed).
 * @returns {JSX.Element}                 Animated wrapper element.
 * @see {@link https://gsap.com/cheatsheet/ gsap cheatsheet}
 */
const ReviewAnimations = ({
  children,
  className,
  index,
  state,
}: {
  children: ReactNode;
  className: string;
  index: number;
  state: boolean;
}): JSX.Element => {
  /** Get the current transition stage from next-transition-router */
  const { stage } = useTransitionState();

  /** Track the previous stage to detect stage changes */
  const [prevStage, setPrevStage] = useState('');

  /** Reference to the DOM element for GSAP animations */
  const ref = useRef(null);

  /**
   * Component toggle animations.
   * Handles expand/collapse animations when the review state changes.
   * Uses GSAP's fromTo timeline to animate height, opacity and position.
   */
  useGSAP(() => {
    /** Create a GSAP timeline for coordinated animations */
    const tl = gsap.timeline({
      paused: true,
    });

    /** Define animation from hidden state to visible state */
    tl.fromTo(
      ref.current,
      {
        autoAlpha: 0,
        height: 0,
        yPercent: -100,
      },
      {
        autoAlpha: 1,
        height: 'auto',
        yPercent: 0,
        duration: 0.35,
        delay: index / 10,
      },
    );

    /** Play animation forward or reverse based on state */
    if (!state) {
      tl.reverse(0.75);
    } else {
      tl.play();
    }

    /** Cleanup function to kill the timeline on unmount */
    return () => {
      tl.kill();
    };
  }, [state]);

  /**
   * Leaving stage animations.
   * Handles fade out animations when transitioning away from the page.
   * Only runs when the component is in an expanded state.
   */
  useGSAP(() => {
    /** Create a GSAP timeline for coordinated animations */
    const tl = gsap.timeline();

    /**
     * Animate to hidden when leaving the page with staggered delay
     * Only animate if component is in expanded state
     */
    if (stage === 'leaving' && prevStage === 'none' && state) {
      tl.to(ref.current, {
        height: 0,
        autoAlpha: 0,
        yPercent: -100,
        duration: 0.5,
        delay: index / 10,
      });
      tl.play();
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

export default ReviewAnimations;
