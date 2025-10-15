/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTransitionState } from 'next-transition-router';
import type { JSX, ReactNode } from 'react';
import { useRef, useState } from 'react';

/**
 * Block card animations component that handles entrance, exit and image reveal animations for individual block cards
 * Uses GSAP library and next-transition-router to create smooth transitions between page states
 * Manages staggered animations based on element index for visually pleasing sequences
 * @param   {object}      props           - Component props
 * @param   {ReactNode}   props.children  - Child elements to be animated (block card content)
 * @param   {string}      props.className - CSS class names for styling the animation wrapper
 * @param   {number}      props.index     - Index of element in array for staggered animations
 * @returns {JSX.Element}                 Block card container with entrance/exit animations
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
  /** Get current transition stage from next-transition-router (entering, leaving, or none) */
  const { stage } = useTransitionState();

  /** State to track the previous transition stage for comparison */
  const [prevStage, setPrevStage] = useState('');

  /** Reference to the DOM element for applying GSAP animations */
  const ref = useRef<any>(null);

  /**
   * Initial entrance animations that play when component mounts
   * Scales and fades in the block card with staggered delay based on index
   * Only runs once on component mount due to empty dependency array
   */
  useGSAP(() => {
    /** Create a GSAP timeline that is initially paused */
    const tl = gsap.timeline({
      paused: true,
    });

    /** Animate card entrance when in initial 'none' stage */
    if (stage === 'none' && prevStage === '') {
      tl.set(ref.current, {
        scale: 0, // Start scaled down to 0
        autoAlpha: 0, // Start hidden (0 opacity and visibility)
      }).to(ref.current, {
        scale: 1, // Scale to full size
        autoAlpha: 1, // Fade in to visible
        duration: 0.5, // Animation duration in seconds
        delay: index / 10, // Staggered delay based on element index
      });
    }

    tl.play(); // Play the entrance animation timeline

    /** Cleanup function to kill timeline on component unmount */
    return () => {
      tl.kill();
    };
  }, []);

  /**
   * Stage-based animations that trigger on transition stage changes
   * Handles exit animations and image reveal animations based on transition states
   * Runs when stage changes due to stage in dependency array
   */
  useGSAP(() => {
    /** Create a GSAP timeline for stage-based animations */
    const tl = gsap.timeline();

    /** Animate card exit when transitioning from 'none' to 'leaving' stage */
    if (stage === 'leaving' && prevStage === 'none') {
      tl.to(ref.current, {
        autoAlpha: 0, // Fade out to hidden
        scale: 0, // Scale down to 0
        duration: 0.35, // Animation duration in seconds
        delay: index / 20, // Staggered delay based on element index
      });
    }

    /** Reveal images when transitioning from 'entering' to 'none' stage */
    if (stage === 'none' && prevStage === 'entering') {
      tl.set(ref.current?.querySelectorAll('img'), {
        autoAlpha: 0, // Initially hide all images
      }).to(ref.current?.querySelectorAll('img'), {
        autoAlpha: 1, // Fade in all images
        duration: 0.35, // Animation duration in seconds
        delay: index / 10, // Staggered delay based on element index
      });
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
    <div className={className} ref={ref}>
      {children}
    </div>
  );
};

export default BlockCardAnimations;
