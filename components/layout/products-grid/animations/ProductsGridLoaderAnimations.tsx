'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTransitionState } from 'next-transition-router';
import type { JSX } from 'react';
import type { ReactNode } from 'react';
import { useRef } from 'react';

/**
 * ProductsGridLoaderAnimations component provides loading animations for product grids using GSAP.
 * It creates a pulsing fade-in/out effect for product card placeholders while content is loading.
 * This component is typically used to enhance the user experience during data fetching operations
 * by showing animated placeholder cards instead of a static loading state.
 * @param   {object}      props           - Component properties
 * @param   {ReactNode}   props.children  - Children ReactNode elements (typically placeholder cards) to be animated
 * @param   {string}      props.className - CSS className to apply to the wrapper element
 * @returns {JSX.Element}                 A div element containing the animated children with loading animations
 * @see {@link https://gsap.com/cheatsheet/ gsap cheatsheet}
 */
const ProductsGridLoaderAnimations = ({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}): JSX.Element => {
  /** Get the current transition stage (entering, leaving, none) */
  const { stage } = useTransitionState();
  /** Reference to the DOM element for animation targeting */
  const ref = useRef(null);

  /** Create loading animations using GSAP timeline */
  useGSAP(() => {
    /** Create a timeline with yoyo effect for continuous pulsing animation */
    const tl = gsap.timeline({
      paused: true,
      yoyo: true,
      repeat: -1, // Infinite repeat
    });

    /** Select all product card elements within the container for animation */
    const cards =
      ref.current &&
      (ref.current as HTMLDivElement).querySelectorAll('.product-card');

    /** Create a pulsing animation sequence: fade in -> pause -> fade out -> repeat */
    tl.from(cards, {
      autoAlpha: 0,
    }).to(cards, {
      autoAlpha: 1,
      duration: 1,
      delay: 0.5,
      stagger: 0.1, // Stagger animation for a wave effect
    });

    /** Start the animation timeline */
    tl.play();

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

export default ProductsGridLoaderAnimations;
