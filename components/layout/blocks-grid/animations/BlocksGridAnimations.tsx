'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTransitionState } from 'next-transition-router';
import type { JSX, ReactNode } from 'react';
import { useRef, useState } from 'react';

/**
 * Blocks grid animations component that handles entrance and exit animations for block grids
 * Uses GSAP library and next-transition-router to create smooth transitions between page states
 * Manages fade in/out animations based on transition stage changes (entering/leaving)
 * @param   {object}      props           - Component props
 * @param   {ReactNode}   props.children  - Child elements to be animated (blocks grid content)
 * @param   {string}      props.className - CSS class names for styling the animation wrapper
 * @returns {JSX.Element}                 Blocks grid container with fade in/out animations
 * @see {@link https://gsap.com/cheatsheet/ gsap cheatsheet}
 */
const BlocksGridAnimations = ({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}): JSX.Element => {
  /** Get current transition stage from next-transition-router (entering, leaving, or none) */
  const { stage } = useTransitionState();

  /** State to track the previous transition stage for comparison */
  const [prevStage, setPrevStage] = useState('');

  /** Reference to the DOM element for applying GSAP animations */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>(null);

  /**
   * GSAP animation effect that triggers on transition stage changes
   * Handles both entrance animation (fade in) and exit animation (fade out)
   * Uses a timeline-based approach for smooth, controlled animations
   */
  useGSAP(() => {
    /** Create a GSAP timeline that is initially paused */
    const tl = gsap.timeline({
      paused: true,
    });

    /** Animate blocks grid entrance when transitioning from 'leaving' to 'entering' stage */
    if (stage === 'entering' && prevStage === 'leaving') {
      tl.set(ref.current, {
        autoAlpha: 0, // Start with hidden state (0 opacity and visibility)
      }).to(ref.current, {
        autoAlpha: 1, // Animate to visible state (1 opacity and visibility)
      });
      tl.play(); // Play the entrance animation timeline
    }

    /** Animate blocks grid exit when transitioning from 'none' to 'leaving' stage */
    if (stage === 'leaving' && prevStage === 'none') {
      tl.to(ref.current, {
        autoAlpha: 0, // Animate to hidden state (0 opacity and visibility)
      });
      tl.play(); // Play the exit animation timeline
    }

    /** Update previous stage to current stage for next comparison */
    setPrevStage(stage);

    /** Cleanup function to kill timeline on component unmount or stage change */
    return () => {
      tl.kill();
    };
  }, [stage]);

  /** Render the animation wrapper with provided className and children */
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default BlocksGridAnimations; // Export the component as the default export
