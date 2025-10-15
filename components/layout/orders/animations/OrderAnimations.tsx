'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import type { JSX, ReactNode } from 'react';
import { useRef } from 'react';

/**
 * Order animations component.
 * Handles expand/collapse animations for order blocks using GSAP.
 * @param   {object}      props           - Order animations props
 * @param   {ReactNode}   props.children  - Child components to be animated
 * @param   {string}      props.className - CSS className for the wrapper element
 * @param   {boolean}     props.isActive  - Current state of order block (expanded/collapsed)
 * @returns {JSX.Element}                 Animated wrapper element
 * @see {@link https://gsap.com/cheatsheet/ gsap cheatsheet}
 */
const OrderAnimations = ({
  children,
  className,
  isActive,
}: {
  children: ReactNode;
  className: string;
  isActive: boolean;
}): JSX.Element => {
  /** Reference to the DOM element for GSAP animations */
  const ref = useRef(null);

  /** GSAP animation hook for order expand/collapse transitions */
  useGSAP(() => {
    /** Create a GSAP timeline for coordinated animations */
    const tl = gsap.timeline({
      paused: true,
    });

    if (isActive) {
      /** Animation for expanding the order block */
      tl.set(ref.current, {
        transformOrigin: '0 0',
        autoAlpha: 0,
        height: 0,
      }).to(ref.current, {
        autoAlpha: 1,
        height: 'auto',
      });
      tl.play();
    } else {
      /** Animation for collapsing the order block */
      tl.to(ref.current, {
        autoAlpha: 0,
        height: 0,
      }).play();
    }

    /** Cleanup function to kill the timeline on unmount */
    return () => {
      tl.kill();
    };
  }, [isActive]);

  /** Render the animated wrapper element */
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default OrderAnimations;
