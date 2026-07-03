'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTransitionState } from 'next-transition-router';
import type { JSX, ReactNode } from 'react';
import { useRef, useState } from 'react';

/**
 * Order row animations component.
 * Handles staggered fade-in and fade-out animations for order rows using GSAP.
 * @param   {object}      props           - Component props
 * @param   {ReactNode}   props.children  - Child components to be animated
 * @param   {string}      props.className - CSS className for the wrapper element
 * @param   {number}      props.index     - Index of element for animations stagger
 * @returns {JSX.Element}                 Animated wrapper element
 * @see {@link https://gsap.com/cheatsheet/ gsap cheatsheet}
 */
const OrderRowAnimations = ({
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

  /** Intro animations - fade in elements with staggered delays */
  useGSAP(() => {
    /** Skip animations if ref is not available */
    if (!ref.current) {
      return;
    }

    /**
     * Hide synchronously, before first paint: a timeline's set() only
     * applies on the next GSAP tick, which can land after paint under
     * main-thread jank — the visible row would flash before being hidden.
     */
    gsap.set(ref.current, {
      autoAlpha: 0,
    });

    /** Create a GSAP timeline for coordinated animations */
    const tl = gsap.timeline({
      paused: true,
    });

    /** Animate to visible with staggered delay based on index */
    tl.to(ref.current, {
      autoAlpha: 1,
      delay: index / 10,
    }).play();

    /** Cleanup function to kill the timeline on unmount */
    return () => {
      tl.kill();
    };
  }, []);

  /** Leaving stage animations - fade out elements when transitioning away */
  useGSAP(() => {
    /** Skip animations if ref is not available */
    if (!ref.current) {
      return;
    }

    /** Create a GSAP timeline for coordinated animations */
    const tl = gsap.timeline({
      paused: true,
    });

    /** Animate to hidden when leaving the page with staggered delay */
    if (stage === 'leaving' && prevStage === 'none') {
      tl.to(ref.current, {
        autoAlpha: 0,
        delay: index / 10,
      }).play();
    }

    /** Update the previous stage */
    setPrevStage(stage);

    /** Cleanup function to kill the timeline on unmount */
    return () => {
      tl.kill();
    };
  }, [stage]);

  /** Render the animated wrapper element */
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default OrderRowAnimations;
