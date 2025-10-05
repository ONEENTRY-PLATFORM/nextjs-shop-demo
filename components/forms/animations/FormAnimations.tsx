'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import type { JSX, ReactNode } from 'react';
import { useContext, useRef } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

/**
 * Form animations.
 * @param   {object}      props           - FormAnimations Props.
 * @param   {ReactNode}   props.children  - children ReactNode.
 * @param   {boolean}     props.isLoading - loading state.
 * @returns {JSX.Element}                 A form component wrapper with animations applied.
 * @see {@link https://gsap.com/cheatsheet/ gsap cheatsheet}
 */
const FormAnimations = ({
  children,
  isLoading,
}: {
  children: ReactNode;
  isLoading: boolean;
}): JSX.Element => {
  // Get open, transition states, and setter from context
  const { open, transition, setTransition } = useContext(OpenDrawerContext);
  // Reference to the DOM element for animations
  const ref = useRef(null);

  // Form transition animations
  useGSAP(() => {
    // Exit early if the drawer is not open, reference is not set, or form is loading
    if (!open || !ref.current || isLoading) {
      return;
    }

    // Create a new GSAP timeline and pause it initially
    const tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        // Reset transition state when animation completes
        setTransition('');
      },
      onReverseComplete: () => {
        // Reset transition state when reverse animation completes
        setTransition('');
      },
    });

    // Define animation from hidden (autoAlpha: 0) to visible (autoAlpha: 1)
    tl.from(ref.current, {
      autoAlpha: 0, // Initial state: hidden
    }).to(ref.current, {
      autoAlpha: 1, // Animate to visible state
    });

    // Reverse or play the animation based on transition state
    if (transition === 'close') {
      tl.reverse(0.5); // Reverse the animation over 0.5 seconds
    } else {
      tl.play(); // Play the animation
    }

    return () => {
      tl.kill(); // Clean up the timeline on unmount or dependency change
    };
  }, [transition, open, isLoading]); // Dependencies for re-running the animation

  // Render the component with the provided children
  return <div ref={ref}>{children}</div>;
};

export default FormAnimations;
