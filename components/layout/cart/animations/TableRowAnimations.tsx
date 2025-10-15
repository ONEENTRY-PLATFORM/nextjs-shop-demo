/* eslint-disable jsdoc/no-undefined-types */
'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import type { JSX } from 'react';
import { useRef } from 'react';

import type { AnimationsProps } from '@/app/types/global';

/**
 * Table row animations component that handles entrance animations for table rows
 * Uses GSAP library to animate table rows with fade-in and slide-up effect
 * Implements staggered animation based on index for smooth sequential entrance
 * @param   {AnimationsProps} props           - Animation component props
 * @param   {ReactNode}       props.children  - Child elements to be animated
 * @param   {string}          props.className - CSS class names for styling the table row wrapper
 * @param   {number}          props.index     - Index of element in array for staggered animation timing
 * @returns {JSX.Element}                     Table row wrapper with entrance animations
 * @see {@link https://gsap.com/cheatsheet/ gsap cheatsheet}
 */
const TableRowAnimations = ({
  children,
  className,
  index,
}: AnimationsProps): JSX.Element => {
  /** Reference to the table row wrapper element for GSAP animations */
  const ref = useRef(null);

  /**
   * GSAP animation effect for initial table row entrance animation
   * Handles fade-in and slide-up animation when table rows are loaded
   */
  useGSAP(() => {
    /** Exit early if ref is not available */
    if (!ref.current) {
      return;
    }

    /** Create GSAP timeline for entrance animation */
    const tl = gsap.timeline({
      paused: true,
    });

    /** Set initial state (hidden and shifted down) and animate to visible state */
    tl.set(ref.current, {
      opacity: 0,
      yPercent: 200, // Start position below the viewport
    }).to(ref.current, {
      opacity: 1,
      yPercent: 0, // End position at original location
      delay: index / 10, // Staggered delay based on index for sequential animation
    });

    /** Play the entrance animation */
    tl.play();

    /** Cleanup function to kill timeline on unmount */
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default TableRowAnimations;
