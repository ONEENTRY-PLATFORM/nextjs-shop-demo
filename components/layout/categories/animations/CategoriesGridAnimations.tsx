'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTransitionState } from 'next-transition-router';
import type { JSX, ReactNode } from 'react';
import { useRef, useState } from 'react';

/**
 * Categories grid stage leaving animations.
 * Uses GSAP library to animate the categories grid during page transitions
 * Specifically handles the leaving animation when navigating away from the categories page
 * @param   {object}      props           - categories grid props
 * @param   {ReactNode}   props.children  - children ReactNode elements to be animated
 * @param   {string}      props.className - CSS class names for styling the categories grid wrapper
 * @returns {JSX.Element}                 categories grid wrapper with exit animations
 * @see {@link https://gsap.com/cheatsheet/ gsap cheatsheet}
 */
const CategoriesGridAnimations = ({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}): JSX.Element => {
  /** Get current transition stage (entering, leaving, none) from next-transition-router */
  const { stage } = useTransitionState();

  /** Track previous stage to determine transition direction */
  const [prevStage, setPrevStage] = useState<string>('');

  /** Reference to the categories grid element for GSAP animations */
  const ref = useRef(null);

  /**
   * GSAP animation effect for categories grid leaving animation
   * Handles fade-out animation when navigating away from the categories page
   */
  useGSAP(() => {
    /** Create GSAP timeline for animations */
    const tl = gsap.timeline({
      paused: true,
    });

    /** Execute leaving animation only when transitioning from 'none' to 'leaving' */
    /** This ensures the animation plays when navigating away from the categories page */
    if (stage === 'leaving' && prevStage === 'none') {
      tl.to(ref.current, {
        autoAlpha: 0,
      });
      tl.play();
    }

    /** Update previous stage to current stage for next render */
    setPrevStage(stage);

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

export default CategoriesGridAnimations;
