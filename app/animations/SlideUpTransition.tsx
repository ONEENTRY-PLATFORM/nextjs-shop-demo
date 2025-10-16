'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTransitionState } from 'next-transition-router';
import type { JSX, ReactNode } from 'react';
import { useRef, useState } from 'react';

/**
 * SlideUp transition
 * @param   {object}      props           - SlideUp transition properties
 * @param   {ReactNode}   props.children  - children ReactNode
 * @param   {string}      props.className - CSS className of ref element
 * @param   {number}      props.index     - Index of element for animations stagger
 * @returns {JSX.Element}                 JSX.Element with animated ref
 * @see {@link https://gsap.com/cheatsheet/ gsap cheatsheet}
 */
const SlideUpTransition = ({
  children,
  className,
  index,
}: {
  children: ReactNode;
  className: string;
  index: number;
}): JSX.Element => {
  /** Get current transition stage from context */
  const { stage } = useTransitionState();
  /** Store previous stage for comparison */
  const [prevStage, setPrevStage] = useState('');
  /** Reference to the DOM element for animations */
  const ref = useRef(null);

  /** on stage change transitions */
  useGSAP(() => {
    /** Exit early if ref is not available */
    if (!ref.current) {
      return;
    }
    /** Create a timeline for slide up animation */
    const tl = gsap.timeline({
      paused: true,
    });

    /** Define the animation sequence */
    tl.from(ref.current, {
      autoAlpha: 0,
      yPercent: 100,
    }).to(ref.current, {
      autoAlpha: 1,
      yPercent: 0,
      duration: 0.5,
      delay: index / 10,
    });

    /** Play or reverse animation based on stage transitions */
    if (stage === 'none' && prevStage === '') {
      tl.play();
    }
    if (stage === 'none' && prevStage === 'entering') {
      tl.play();
    }
    if (stage === 'leaving' && prevStage === 'none') {
      tl.reverse(1);
    }

    /** Update previous stage state */
    setPrevStage(stage);

    /** Cleanup function to kill timeline on unmount */
    return () => {
      tl.kill();
    };
  }, [stage]);

  /** Render the animated component */
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default SlideUpTransition;
