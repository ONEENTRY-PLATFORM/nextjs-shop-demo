'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTransitionState } from 'next-transition-router';
import type { JSX, ReactNode } from 'react';
import { useRef, useState } from 'react';

/**
 * CardsGridAnimations component provides exit animations for product card grids using GSAP.
 * It handles the leaving animation when transitioning between different views or pages.
 * The component tracks transition states and applies fade-out and scale animations to
 * cards that are currently in view before the container itself fades out.
 * @param   {object}      props           - Component properties
 * @param   {ReactNode}   props.children  - Children ReactNode elements to be animated
 * @param   {string}      props.className - CSS className to apply to the wrapper element
 * @returns {JSX.Element}                 A div element containing the animated children with exit animations
 * @see {@link https://gsap.com/cheatsheet/ gsap cheatsheet}
 */
const CardsGridAnimations = ({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}): JSX.Element => {
  /** Get the current transition stage (entering, leaving, none) */
  const { stage } = useTransitionState();
  /** Track previous transition stage to determine animation conditions */
  const [prevStage, setPrevStage] = useState('');
  /** Reference to the DOM element for animation targeting */
  const ref = useRef(null);

  /** Leaving animations using GSAP timeline */
  useGSAP(() => {
    /** Create a paused timeline for coordinated exit animations */
    const tl = gsap.timeline({
      paused: true,
    });

    /** Execute leaving animation when transitioning from 'none' to 'leaving' stage */
    if (stage === 'leaving' && prevStage === 'none') {
      /** Select all cards that are currently in view for individual animation */
      const cards =
        ref.current &&
        (ref.current as HTMLDivElement).querySelectorAll('.in-view');

      /** Animate individual cards, then fade out the entire container */
      tl.to(cards, {
        autoAlpha: 0,
        scale: 0,
        duration: 0.45,
        stagger: 0.05,
      }).to(ref.current, {
        autoAlpha: 0,
        duration: 0.35,
      });
      tl.play();
    }

    /** Update previous stage for next render */
    setPrevStage(stage);

    /** Cleanup function to kill timeline on component unmount */
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

export default CardsGridAnimations;
